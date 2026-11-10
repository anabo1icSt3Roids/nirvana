// Vite plugin that serves the /api endpoints locally during `npm run dev`
import url from "url";
import enquiriesHandler from "./api/enquiries.js";
import productsHandler from "./api/products.js";
import authHandler from "./api/auth.js";

export function localApiPlugin() {
  return {
    name: "local-api-endpoints",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;

        if (pathname === "/api/enquiries" || pathname === "/api/products" || pathname === "/api/auth") {
          // Parse request body for POST/PUT/PATCH requests
          if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
            const buffers = [];
            for await (const chunk of req) {
              buffers.push(chunk);
            }
            const rawBody = Buffer.concat(buffers).toString();
            try {
              req.body = rawBody ? JSON.parse(rawBody) : {};
            } catch {
              req.body = {};
            }
          }

          req.query = parsedUrl.query;

          // Add mock response helper methods (json, status, end) like Express / Vercel
          res.status = (code) => {
            res.statusCode = code;
            return res;
          };
          res.json = (data) => {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(data));
            return res;
          };

          if (pathname === "/api/auth") {
            await authHandler(req, res);
            return;
          }
          if (pathname === "/api/enquiries") {
            await enquiriesHandler(req, res);
            return;
          }
          if (pathname === "/api/products") {
            await productsHandler(req, res);
            return;
          }
        }
        next();
      });
    }
  };
}
