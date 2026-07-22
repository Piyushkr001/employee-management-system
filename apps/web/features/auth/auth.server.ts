import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthenticatedUserDto, ApiResponse } from "@empnexa/shared";
import { cache } from "react";
import { AUTH_COOKIE_NAME } from "@/lib/auth-config";
import { getInternalApiUrl } from "@/lib/api-utils";
export const getCurrentUserServer = async (): Promise<AuthenticatedUserDto | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const baseUrl = getInternalApiUrl().replace(/\/+$/, "");
  
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
    const payload = await res.json();
    if (payload?.error?.code === "ACCOUNT_INACTIVE") {
      redirect("/login?reason=inactive");
    }
    redirect("/unauthorized");
  }

  if (!res.ok) {
    throw new Error("Authentication service is unavailable");
  }

  const data: ApiResponse<{ user: AuthenticatedUserDto }> = await res.json();
  return data.data?.user || null;
}

export const getCurrentUserCached = cache(getCurrentUserServer);
