import { Router } from "express";
import {
  buildGoogleAuthUrl,
  exchangeCodeForAccessToken,
  fetchGoogleProfile,
} from "../lib/google-oauth.js";
import { signAuthToken } from "../lib/jwt.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  findOrCreateGoogleUser,
  findUserById,
} from "../repository/user.repository.js";

const router = Router();

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: false,
};

router.get("/google", (_req, res) => {
  const url = buildGoogleAuthUrl();
  res.redirect(url);
});

router.get("/google/callback", async (req, res) => {
  const code = req.query.code;

  if (!code || typeof code !== "string") {
    res.status(400).json({ error: "Missing authorization code" });
    return;
  }

  try {
    const accessToken = await exchangeCodeForAccessToken(code);
    const profile = await fetchGoogleProfile(accessToken);

    const user = await findOrCreateGoogleUser({
      googleId: profile.id,
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.picture,
    });

    const token = signAuthToken({
      userId: user.id,
      email: user.email,
    });

    res.cookie("token", token, cookieOptions);

    const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";
    res.redirect(`${frontendUrl}/dashboard`);
  } catch (error) {
    console.error("OAuth callback failed:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  const user = await findUserById(req.auth!.userId);

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
  });
});

router.post("/logout", (_req, res) => {
  res.clearCookie("token", cookieOptions);
  res.json({ success: true });
});

export default router;
