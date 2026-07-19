import { cookies } from "next/headers";
import type { ApiResponse } from "@empnexa/shared";

const getServerApiBaseUrl = () =>
  (
    process.env.API_INTERNAL_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:5000/api"
  ).replace(/\/+$/, "");

export async function fetchEmployeeApiServer<T>(
  endpoint: string,
  init: RequestInit = {},
): Promise<ApiResponse<T>> {
  const cookieStore = await cookies();

  const cookieName =
    process.env.AUTH_COOKIE_NAME ??
    "empnexa_token";

  const token = cookieStore.get(cookieName)?.value;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const normalizedEndpoint = `/${endpoint.replace(/^\/+/, "")}`;

  const response = await fetch(
    `${getServerApiBaseUrl()}${normalizedEndpoint}`,
    {
      ...init,
      headers: {
        Accept: "application/json",
        Cookie: `${cookieName}=${token}`,
        ...init.headers,
      },
      cache: "no-store",
    },
  );

  const text = await response.text();

  let payload: ApiResponse<T>;

  try {
    payload = text
      ? JSON.parse(text)
      : {
          success: response.ok,
          message: response.statusText,
        };
  } catch {
    throw new Error(
      "Employee API returned an invalid response",
    );
  }

  if (!response.ok) {
    // We attach the full payload so callers can check `error.code` or `error.fieldErrors` if needed
    const err = new Error(payload.message || "Employee API request failed");
    (err as any).payload = payload;
    throw err;
  }

  return payload;
}

import { EmployeeDto, EmployeePaginatedResponse } from "./employee.api";

export async function getEmployeesServer(query: Record<string, any> = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  const endpoint = queryString ? `/employees?${queryString}` : "/employees";
  
  return fetchEmployeeApiServer<EmployeePaginatedResponse>(endpoint);
}

export async function getEmployeeByIdServer(id: string) {
  return fetchEmployeeApiServer<EmployeeDto>(`/employees/${id}`);
}
