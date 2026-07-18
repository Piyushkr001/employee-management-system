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
    expiresIn: parseInt(env.JWT_EXPIRES_IN_SECONDS as unknown as string, 10),
    issuer: "empnexa-api",
    audience: "empnexa-web",
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET, {
    issuer: "empnexa-api",
    audience: "empnexa-web",
  }) as JwtPayload;
}
