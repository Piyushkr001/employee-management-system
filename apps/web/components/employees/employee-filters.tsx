"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { EMPLOYEE_STATUSES } from "@empnexa/shared";

export function EmployeeFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("?");
  };

  const hasFilters = Array.from(searchParams.keys()).some(
    key => ["department", "status", "role", "search"].includes(key)
  );

  return (
    <div className="flex items-center gap-2">
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
