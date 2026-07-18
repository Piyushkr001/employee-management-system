import app from "./app";
import { env } from "./config/env";
import { client } from "./db";

const startServer = async () => {
  try {
    const server = app.listen(env.PORT, () => {
      console.log(`🚀 EmpNexa API is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });

    server.on("error", (error: NodeJS.ErrnoException) => {
      if (error.syscall !== "listen") {
        throw error;
      }
      
      if (error.code === "EADDRINUSE") {
        console.error(`❌ Port ${env.PORT} is already in use`);
      } else {
        console.error("❌ Server startup error:", error);
      }
      process.exit(1);
    });

    const gracefulShutdown = async (signal: string) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        console.log("HTTP server closed.");
        await client.end();
        console.log("Database connection closed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
