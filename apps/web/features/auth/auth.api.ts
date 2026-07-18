import { LoginInput, AuthenticatedUser, ApiResponse } from "@empnexa/shared";

// Improved fetchApi with typing support
export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
  });

  // Handle empty responses
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    // If it's a known API error format
    if (data && data.success === false) {
      throw data; // Throw the ApiResponse object so we can read fieldErrors
    }
    // Fallback
    throw {
      success: false,
      message: data.message || "An unexpected error occurred",
    } as ApiResponse<unknown>;
  }

  return data as ApiResponse<T>;
}

export const authApi = {
  login: async (input: LoginInput) => {
    return fetchApi<{ user: AuthenticatedUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  
  logout: async () => {
    return fetchApi("/auth/logout", {
      method: "POST",
    });
  },
  
  getCurrentUser: async () => {
    return fetchApi<{ user: AuthenticatedUser }>("/auth/me", {
      method: "GET",
    });
  },
};
