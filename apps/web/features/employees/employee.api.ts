import { fetchApi } from "../auth/auth.api";
import { EmployeeListQuery, CreateEmployeeInput, UpdateEmployeeInput, EmployeeDto, ManagerOptionDto } from "@empnexa/shared";
export type { EmployeeListQuery, CreateEmployeeInput, UpdateEmployeeInput, EmployeeDto, ManagerOptionDto };

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

    return fetchApi<EmployeePaginatedResponse>(`/employees?${searchParams.toString()}`, {
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
    return fetchApi<{ managers: ManagerOptionDto[] }>(
      `/employees/manager-options?${searchParams.toString()}`,
      { method: "GET", signal }
    );
  },

  getManagerOptionById: async (id: string, signal?: AbortSignal) => {
    return fetchApi<ManagerOptionDto>(
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
    return fetchApi<void>(`/employees/${id}`, {
      method: "DELETE",
    });
  },
};
