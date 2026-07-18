import { Router } from "express";
import { sendResponse } from "../../utils/response";
import { env } from "../../config/env";
// import db from "../../db"; // Will uncomment after DB is set up

const router = Router();

router.get("/", async (req, res) => {
  let dbStatus = "Unknown";
  
  // Basic check placeholder, will connect to actual DB soon
  dbStatus = "Connected"; 

  sendResponse(res, 200, "EmpNexa API is operational", {
    service: "empnexa-api",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

export default router;
