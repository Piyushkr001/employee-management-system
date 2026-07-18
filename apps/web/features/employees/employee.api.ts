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
