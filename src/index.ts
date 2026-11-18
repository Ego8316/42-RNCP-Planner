import { serve } from "bun";
import index from "./index.html";
import { api } from "./server/api";

const server = serve({
    routes: {
        "/api/*": (request) => api.handle(request),

        // Serve index.html for all unmatched routes.
        "/*": index,
    },

    development: process.env.NODE_ENV !== "production" && {
        // Enable browser hot reloading in development
        hmr: true,

        // Echo console logs from the browser to the server
        console: true,
    },
});

console.log(`🚀 Server running at ${server.url}`);
