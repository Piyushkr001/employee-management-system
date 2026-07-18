import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UserRole } from "@empnexa/shared";

export type JwtPayload = {
  sub: string;
  role: UserRole;
  employeeCode: string;
};

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}
