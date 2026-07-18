import { cookies } from "next/headers";
import { AuthenticatedUserDto, ApiResponse } from "@empnexa/shared";

export async function getCurrentUserServer(): Promise<AuthenticatedUserDto | null> {
  const cookieStore = await cookies();
  const cookieName = process.env.AUTH_COOKIE_NAME || "empnexa_token";
  const token = cookieStore.get(cookieName)?.value;

  if (!token) {
    return null;
  }

  const baseUrl = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  
  try {
    const res = await fetch(`${baseUrl}/auth/me`, {
      headers: {
        Cookie: `${cookieName}=${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status >= 500) {
        console.error(`[getCurrentUserServer] Backend error: ${res.status}`);
      }
      return null;
    }

    const data: ApiResponse<{ user: AuthenticatedUserDto }> = await res.json();
    return data.data?.user || null;
  } catch (error) {
    console.error("[getCurrentUserServer] Fetch failed:", error);
    return null;
  }
}
