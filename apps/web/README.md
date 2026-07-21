# EmpNexa Web (Frontend)

This is the Next.js frontend application for EmpNexa, built using the App Router.

## Environment Variables

Ensure your `apps/web/.env` is properly configured:
- `NEXT_PUBLIC_API_URL=/backend`: Used by the browser client to hit the Next.js API proxy route. This ensures same-origin requests to preserve HTTP-only cookies without complex CORS configurations.
- `API_PROXY_TARGET`: The backend URL the Next.js proxy should forward requests to.
- `API_INTERNAL_URL`: Mandatory for production Server Components to communicate with the backend.
- `AUTH_COOKIE_NAME`: The name of the authentication cookie to read (e.g. `empnexa_token`). This must identically match the backend's `COOKIE_NAME`.

## Deployment

In production, ensure `API_INTERNAL_URL` is configured correctly, otherwise the build and server startup will intentionally fail to protect against broken Server Component renders.
