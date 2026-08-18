import { Router, type Request, type Response } from "express";
import { requireAdmin } from "../../middleware/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { Promo } from "../../models/Promo";
import { Types } from "mongoose";
import { ok } from "../../utils/envelope";
import { requireFound, requireText } from "../../utils/helpers";
import { AppError } from "../../utils/AppError";

type PromoDbItem = {
  _id?: Types.ObjectId;
  code: string;
  percentage: number;
  count: number;
  minimumOrderValue: number;
  startsAt: Date;
  endsAt: Date;
  createdAt?: Date;
};

function mapPromo(item: PromoDbItem) {
  return {
    _id: String(item._id || ""),
    code: item.code,
    percentage: item.percentage,
    count: item.count,
    minimumOrderValue: item.minimumOrderValue,
    startsAt: item.startsAt,
    endsAt: item.endsAt,
    createdAt: item.createdAt,
  };
}

export const adminPromoRouter = Router();

adminPromoRouter.use(requireAdmin);

function parsePromoPayload(req: Request) {
  const code = String(req.body.code || "")
    .trim()
    .toUpperCase();
  const percentage = Number(req.body.percentage);
  const count = Number(req.body.count);
  const minimumOrderValue = Number(req.body.minimumOrderValue);
  const startsAt = new Date(req.body.startsAt);
  const endsAt = new Date(req.body.endsAt);

  requireText(code, "promo code is required");

  if (Number.isNaN(percentage) || percentage < 1 || percentage > 100) {
    throw new AppError(400, "Percentage must be between 1 and 10");
  }

  if (!Number.isInteger(count) || count < 1) {
    throw new AppError(400, "Promo count must be atleast 1");
  }

  if (Number.isNaN(minimumOrderValue) || minimumOrderValue < 0) {
    throw new AppError(400, "Promo count must be atleast 0 or more");
  }

  if (Number.isNaN(startsAt.getTime())) {
    throw new AppError(400, "Valid start time is required");
  }
  if (Number.isNaN(endsAt.getTime())) {
    throw new AppError(400, "Valid end time is required");
  }

  if (endsAt <= startsAt) {
    throw new AppError(400, "End time should be after start time");
  }

  return {
    code,
    percentage,
    count,
    minimumOrderValue,
    startsAt,
    endsAt,
  };
}

async function getAllPromos() {
  const promos = await Promo.find().sort({ createdAt: -1 });

  return promos.map((item) => mapPromo(item.toObject()));
}

adminPromoRouter.get(
  "/promos",

  asyncHandler(async (req: Request, res: Response) => {
    res.json(
      ok({
        items: await getAllPromos(),
      }),
    );
  }),
);

adminPromoRouter.post(
  "/promos",

  asyncHandler(async (req: Request, res: Response) => {
    const payload = parsePromoPayload(req);

    const existingPromo = await Promo.findOne({ code: payload.code });

    if (existingPromo) {
      throw new AppError(400, "Promo code already exists");
    }

    await Promo.create(payload);

    res.json(
      ok({
        items: await getAllPromos(),
      }),
    );
  }),
);

adminPromoRouter.patch(
  "/promos/:promoId",

  asyncHandler(async (req: Request, res: Response) => {
    const promoId = String(req.params.promoId || "").trim();
    requireText(promoId, "Promo Id is needed here");

    const payload = parsePromoPayload(req);

    const promo = await Promo.findById(promoId);
    const foundPromo = requireFound(promo, "Promo not found", 404);

    const existingPromo = await Promo.findOne({
      code: payload.code,
      _id: { $ne: foundPromo._id },
    });

    if (existingPromo) {
      throw new AppError(400, "Promo code already exists");
    }

    foundPromo.code = payload.code;
    foundPromo.percentage = payload.percentage;
    foundPromo.count = payload.count;
    foundPromo.minimumOrderValue = payload.minimumOrderValue;
    foundPromo.startsAt = payload.startsAt;
    foundPromo.endsAt = payload.endsAt;

    await foundPromo.save();

    res.json(
      ok({
        items: await getAllPromos(),
      }),
    );
  }),
);

adminPromoRouter.delete(
  "/promos/:promoId",

  asyncHandler(async (req: Request, res: Response) => {
    const promoId = String(req.params.promoId || "").trim();
    requireText(promoId, "Promo Id is needed here");

    const promo = await Promo.findById(promoId);
    requireFound(promo, "Promo not found", 404);

    await Promo.findByIdAndDelete(promoId);

    res.json(
      ok({
        items: await getAllPromos(),
      }),
    );
  }),
);
