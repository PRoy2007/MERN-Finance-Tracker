Learning MERN stack: an MVP finance tracker.

## Deploying on Vercel

The root `vercel.json` configures the `client` (Vite) and `server` (Express)
services. The client is served on all non-API paths, while `/api/*` is routed
to the Express service. Set `MONGO_URI` and `JWT_SECRET` in the Vercel
environment settings for the server service. No service bindings are needed:
the browser calls the API through the public `/api` route.

Use `vercel dev` to run the configured services together locally.

Demo video: https://youtu.be/rM7uBcjKabI
^^forgot not to record audio. Video is not available in Russia and Belarus
