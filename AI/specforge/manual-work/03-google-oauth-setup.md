# Manual Work — 03 Google OAuth Setup

## Status

Already completed manually.

## Google Cloud setup completed

- Google Cloud project is created or selected.
- OAuth consent screen is configured.
- OAuth Client credentials are created.
- Application type is set to Web application.
- Authorized redirect URI is added:

```txt
http://localhost:4000/auth/google/callback
```

## Values already added to `server/.env`

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:4000/auth/google/callback
FRONTEND_URL=http://localhost:3000
```

## Boundary

No backend auth files were created manually.

Only Google Cloud credentials and `server/.env` values were prepared.
