import { CookieOptions } from "express";
import { env } from "./env";

const maxAge = 1000 * 60 * 60 * 8; // 8 hours

export const getCookieOptions = (): CookieOptions => {
  const isProduction = env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge,
  };
};
