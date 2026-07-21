import { CookieOptions } from "express";
import { env } from "./env";

export const getAuthCookieOptions = (): CookieOptions => {
  const isProduction = env.NODE_ENV === "production";
  const maxAge = env.JWT_EXPIRES_IN_SECONDS * 1000;

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge,
  };
};

export const getClearAuthCookieOptions = (): CookieOptions => {
  const isProduction = env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  };
};
