import { Router } from "express";
import { sendResponse } from "../../utils/response";
import { env } from "../../config/env";
// import db from "../../db"; // Will uncomment after DB is set up

import db from "../../db";
import { sql } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    await db.execute(sql`SELECT 1`);
    
    sendResponse(res, 200, "EmpNexa API is operational", {
      service: "empnexa-api",
      database: "connected",
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: "EmpNexa API is degraded",
      error: {
        code: "DATABASE_UNAVAILABLE"
      }
    });
  }
});

export default router;
