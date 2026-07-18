import app from "./app";
import { env } from "./config/env";

import db from "./db";

const startServer = async () => {
  try {
    const server = app.listen(env.PORT, () => {
      console.log(`🚀 EmpNexa API is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });

    server.on("error", (error) => {
      console.error("❌ Server startup error:", error);
      process.exit(1);
    });

    const gracefulShutdown = async () => {
      console.log("Shutting down gracefully...");
      server.close(() => {
        console.log("HTTP server closed.");
      });
      // End DB connection if necessary; drizzle doesn't natively have a clean 'close' for postgres.js client
      // but if we exported the `client` we could close it. We'll leave it simple for now or import client.
      process.exit(0);
    };

    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);
    
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
