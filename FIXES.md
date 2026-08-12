# FounderConnect deployment fixes

This copy was audited from the uploaded repository and patched without changing the existing client/server folder structure.

## Fixed

1. Added `client/vercel.json` for React Router SPA refresh/deep-link routing.
2. Centralized production API access in `client/src/services/api/api.js`.
3. Replaced all direct frontend `axios` calls that used `http://localhost:8000/api/v1/...` with the shared API client.
4. Added access-token persistence after login.
5. Increased Express JSON/urlencoded body limits from 16 KB to 1 MB to allow the existing base64 profile-picture flow.
6. Made production CORS configurable while allowing the current Vercel frontend and local Vite development.
7. Made auth cookies consistently cross-site compatible (`secure` + `sameSite: "none"`).
8. Fixed refresh-token variable naming in the refresh endpoint.
9. Fixed account-update validation so duplicate username/email checks happen before the database update.
10. Normalized registration username/email.
11. Made MongoDB connection failures throw instead of terminating the serverless process.
12. Kept the existing project structure intact.

## Important

The backend URL used by the shared client defaults to:

`https://founder-connect-khf4.vercel.app/api/v1`

If a Vercel environment variable named `VITE_API_BASE_URL` exists, it takes precedence. It must contain the plain URL only, not Markdown link syntax.

The Socket.IO client still defaults to localhost because realtime Socket.IO deployment requires its own production WebSocket setup. The REST/API fixes above do not require changing the project structure.
