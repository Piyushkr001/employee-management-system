import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error-handler";
import { notFound } from "./middleware/not-found";
import healthRoutes from "./modules/health";
import authRoutes from "./modules/auth/auth.routes";
import { employeeRoutes } from "./modules/employees/employee.routes";
import { ApiError } from "./utils/api-error";

const app: Express = express();

app.set("trust proxy", 1);

// Rate Limiting
const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // Stricter limit for login/mutations
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

// Basic CSRF & Origin protection for mutations
const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  if (["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
    const origin = req.get("origin");
    if (origin && origin !== env.CLIENT_URL) {
      return next(new ApiError(403, "Invalid Origin"));
    }
  }
  next();
};
app.use(csrfProtection);

app.use(standardLimiter);

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth/login", strictLimiter);
app.use("/api/auth", authRoutes);

app.use("/api/employees", (req, res, next) => {
  if (["POST", "PUT", "DELETE"].includes(req.method)) {
    strictLimiter(req, res, next);
  } else {
    next();
  }
}, employeeRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
