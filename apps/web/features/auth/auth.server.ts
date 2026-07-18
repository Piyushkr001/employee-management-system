import { cookies } from "next/headers";
import { AuthenticatedUser, ApiResponse } from "@empnexa/shared";

export async function getCurrentUserServer(): Promise<AuthenticatedUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("empnexa_token")?.value;

  if (!token) {
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  
  try {
    const res = await fetch(`${baseUrl}/auth/me`, {
      headers: {
        Cookie: `empnexa_token=${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data: ApiResponse<{ user: AuthenticatedUser }> = await res.json();
    return data.data?.user || null;
  } catch (error) {
    return null;
  }
}
