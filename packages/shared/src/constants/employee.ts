export const EMPLOYEE_STATUSES = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export const EMPLOYEE_SORT_FIELDS = [
  "name",
  "employeeCode",
  "email",
  "department",
  "designation",
  "joiningDate",
  "createdAt",
] as const;

export const SORT_ORDERS = [
  "asc",
  "desc",
] as const;

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
