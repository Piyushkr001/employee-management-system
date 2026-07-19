import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthenticatedUserDto, ApiResponse } from "@empnexa/shared";
import { cache } from "react";
import { AUTH_COOKIE_NAME } from "@/lib/auth-config";

export const getCurrentUserServer = async (): Promise<AuthenticatedUserDto | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const baseUrl = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  
  let res: Response;
  try {
    res = await fetch(`${baseUrl}/auth/me`, {
      headers: {
        Cookie: `${AUTH_COOKIE_NAME}=${token}`,
      },
      cache: "no-store",
    });
  } catch {
    throw new Error("Backend service is unreachable");
  }

  if (res.status === 401) {
    return null;
  }
  if (res.status === 403) {
    redirect("/unauthorized");
  }
  if (res.status >= 500) {
    throw new Error("Backend service is unavailable");
  }

  if (!res.ok) {
    return null;
  }

  const data: ApiResponse<{ user: AuthenticatedUserDto }> = await res.json();
  return data.data?.user || null;
}

export const getCurrentUserCached = cache(getCurrentUserServer);
