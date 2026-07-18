import { Router } from "express";
import { sendResponse } from "../../utils/response";
import { env } from "../../config/env";
// import db from "../../db"; // Will uncomment after DB is set up

import db from "../../db";
import { sql } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  let dbStatus = "disconnected";
  let statusCode = 200;
  
  try {
    const result = await db.execute(sql`SELECT 1`);
    if (result) {
      dbStatus = "connected";
    }
  } catch (error) {
    dbStatus = "unavailable";
    statusCode = 503;
  }

  sendResponse(res, statusCode, "EmpNexa API is operational", {
    service: "empnexa-api",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

export default router;
