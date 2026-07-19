import { fetchApi } from "../auth/auth.api";
import { EmployeeListQuery, CreateEmployeeInput, UpdateEmployeeInput, AuthenticatedUserDto } from "@empnexa/shared";

// The mapped Employee response from the API for a single employee
export type EmployeeDto = Omit<AuthenticatedUserDto, "id"> & {
  id: string;
  salary?: number;
  manager?: {
    id: string;
    employeeCode: string;
    name: string;
    designation: string;
  };
};

export type EmployeePaginatedResponse = {
  employees: EmployeeDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export const employeeApi = {
  list: async (query: EmployeeListQuery) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });

    return fetchApi<{ employees: EmployeeDto[], pagination: any }>(`/employees?${searchParams.toString()}`, {
      method: "GET",
    });
  },

  getManagerOptions: async (excludeEmployeeId?: string, search?: string, signal?: AbortSignal) => {
    const searchParams = new URLSearchParams();
    if (excludeEmployeeId) {
      searchParams.append("excludeEmployeeId", excludeEmployeeId);
    }
    if (search) {
      searchParams.append("search", search);
    }
    return fetchApi<{ managers: Pick<EmployeeDto, "id" | "employeeCode" | "name" | "designation" | "department" | "status">[] }>(
      `/employees/manager-options?${searchParams.toString()}`,
      { method: "GET", signal }
    );
  },

  getManagerOptionById: async (id: string, signal?: AbortSignal) => {
    return fetchApi<Pick<EmployeeDto, "id" | "employeeCode" | "name" | "designation" | "department" | "status">>(
      `/employees/manager-options/${id}`,
      { method: "GET", signal }
    );
  },

  getById: async (id: string) => {
    return fetchApi<EmployeeDto>(`/employees/${id}`, {
      method: "GET",
    });
  },

  create: async (input: CreateEmployeeInput) => {
    return fetchApi<EmployeeDto>("/employees", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  update: async (id: string, input: UpdateEmployeeInput) => {
    return fetchApi<EmployeeDto>(`/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
  },

  softDelete: async (id: string) => {
    return fetchApi<{ success: boolean }>(`/employees/${id}`, {
      method: "DELETE",
    });
  },
};
