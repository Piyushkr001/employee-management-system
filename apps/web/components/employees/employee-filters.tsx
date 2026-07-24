"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button, buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { X, SlidersHorizontal } from "lucide-react";
import { EMPLOYEE_STATUSES, EMPLOYEE_SORT_FIELDS, SORT_ORDERS } from "@empnexa/shared";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FilterCombobox } from "./filter-combobox";
import { employeeApi } from "@/features/employees/employee.api";
import { ManagerOptionDto } from "@empnexa/shared";
import { useState, useEffect } from "react";
import { ManagerSelect } from "./manager-select";

export function EmployeeFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all" && value !== "none") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.replace(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.replace("?");
  };

  const hasFilters = Array.from(searchParams.keys()).some(
    key => ["department", "designation", "status", "role", "search", "managerId", "sortBy", "sortOrder", "limit"].includes(key)
  );

  const [department, setDepartment] = useState(searchParams.get("department") || "");
  const [designation, setDesignation] = useState(searchParams.get("designation") || "");

  useEffect(() => {
    setDepartment(searchParams.get("department") || "");
    setDesignation(searchParams.get("designation") || "");
  }, [searchParams]);

  const managerId = searchParams.get("managerId");
  const [currentManager, setCurrentManager] = useState<ManagerOptionDto | null>(null);

  useEffect(() => {
    if (!managerId) {
      setCurrentManager(null);
      return;
    }
    let isMounted = true;
    employeeApi.getManagerOptionById(managerId).then((res) => {
      if (isMounted && res.data) {
        setCurrentManager(res.data as any);
      }
    }).catch(console.error);
    return () => { isMounted = false; };
  }, [managerId]);

  const [filterOptions, setFilterOptions] = useState<{ departments: string[]; designations: string[] }>({ departments: [], designations: [] });

  useEffect(() => {
    let isMounted = true;
    employeeApi.getFilterOptions().then(res => {
      if (isMounted && res.data) {
        setFilterOptions(res.data as any);
      }
    }).catch(console.error);
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <Popover>
        <PopoverTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-10 border-dashed")}>
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Advanced Filters
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="end">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <FilterCombobox 
                value={department}
                onChange={(val) => {
                  setDepartment(val);
                  handleFilterChange("department", val);
                }}
                options={filterOptions.departments}
                placeholder="Department"
                emptyText="No department found"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Designation</label>
              <FilterCombobox 
                value={designation}
                onChange={(val) => {
                  setDesignation(val);
                  handleFilterChange("designation", val);
                }}
                options={filterOptions.designations}
                placeholder="Designation"
                emptyText="No designation found"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Manager</label>
              <ManagerSelect 
                value={searchParams.get("managerId") || ""}
                onChange={(val) => handleFilterChange("managerId", val)}
                currentManager={currentManager}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select
                value={searchParams.get("sortBy") || "createdAt"}
                onValueChange={(val: string | null) => handleFilterChange("sortBy", val || "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYEE_SORT_FIELDS.map(field => (
                    <SelectItem key={field} value={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sort Order</label>
              <Select
                value={searchParams.get("sortOrder") || "desc"}
                onValueChange={(val: string | null) => handleFilterChange("sortOrder", val || "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Page Size</label>
              <Select
                value={searchParams.get("limit") || "10"}
                onValueChange={(val: string | null) => handleFilterChange("limit", val || "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                  <SelectItem value="100">100 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Select
        value={searchParams.get("status") || "all"}
        onValueChange={(val) => handleFilterChange("status", val || "all")}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value={EMPLOYEE_STATUSES.ACTIVE}>Active</SelectItem>
          <SelectItem value={EMPLOYEE_STATUSES.INACTIVE}>Inactive</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("role") || "all"}
        onValueChange={(val) => handleFilterChange("role", val || "all")}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="employee">Employee</SelectItem>
          <SelectItem value="hr_manager">HR Manager</SelectItem>
          <SelectItem value="super_admin">Super Admin</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear filters">
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
