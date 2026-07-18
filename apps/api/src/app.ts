import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error-handler";
import { notFound } from "./middleware/not-found";
import healthRoutes from "./modules/health";

const app: Express = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/health", healthRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
