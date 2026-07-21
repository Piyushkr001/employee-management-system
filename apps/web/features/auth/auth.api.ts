import { LoginInput, AuthenticatedUserDto, ApiResponse } from "@empnexa/shared";

export class ApiClientError extends Error {
  status: number;
  code?: string;
  fieldErrors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    code?: string,
    fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "/backend";
  const url = `${baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  const isMutation = ["POST", "PUT", "DELETE", "PATCH"].includes(options?.method?.toUpperCase() || "GET");
  const defaultHeaders: Record<string, string> = {
    "Accept": "application/json",
  };
  
  if (isMutation) {
    defaultHeaders["Content-Type"] = "application/json";
    defaultHeaders["X-EmpNexa-Request"] = "web";
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
    credentials: "include",
  });

  let data: any = {};
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: "Invalid JSON response" };
    }
  }

  if (!response.ok) {
    throw new ApiClientError(
      data.message || "An unexpected error occurred",
      response.status,
      data.error?.code,
      data.error?.fieldErrors
    );
  }

  return data as ApiResponse<T>;
}

export const authApi = {
  login: async (input: LoginInput) => {
    return fetchApi<{ user: AuthenticatedUserDto }>("/auth/login", {
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
    return fetchApi<{ user: AuthenticatedUserDto }>("/auth/me", {
      method: "GET",
    });
  },
};
