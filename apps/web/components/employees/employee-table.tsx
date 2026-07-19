"use client";

import { useState } from "react";
import { EmployeeDto } from "@/features/employees/employee.api";
import { UserRole } from "@empnexa/shared";
import { EmployeeStatusBadge } from "./employee-status-badge";
import { EmployeeRoleBadge } from "./employee-role-badge";
import { EmployeeActions } from "./employee-actions";
import { EmployeePagination } from "./employee-pagination";
import { DeleteEmployeeDialog } from "./delete-employee-dialog";

interface EmployeeTableProps {
  employees: EmployeeDto[];
  currentUserRole: UserRole;
  pagination: {
    page: number;
    total: number;
    totalPages: number;
  };
}

export function EmployeeTable({ employees, currentUserRole, pagination }: EmployeeTableProps) {
  const [employeeToDelete, setEmployeeToDelete] = useState<EmployeeDto | null>(null);

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card text-card-foreground shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Employee</th>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Designation</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Joining Date</th>
                {currentUserRole !== "employee" && <th className="px-4 py-3 font-medium">Salary</th>}
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                    No employees found
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{employee.name}</span>
                        <span className="text-xs text-muted-foreground">{employee.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{employee.employeeCode}</td>
                    <td className="px-4 py-3">{employee.department}</td>
                    <td className="px-4 py-3">{employee.designation}</td>
                    <td className="px-4 py-3">
                      <EmployeeRoleBadge role={employee.role} />
                    </td>
                    <td className="px-4 py-3">
                      <EmployeeStatusBadge status={employee.status as any} />
                    </td>
                    <td className="px-4 py-3">{employee.joiningDate}</td>
                    {currentUserRole !== "employee" && (
                      <td className="px-4 py-3">
                        {employee.salary !== undefined && employee.salary !== null
                          ? new Intl.NumberFormat("en-IN", {
                              style: "currency",
                              currency: "INR",
                              maximumFractionDigits: 0,
                            }).format(employee.salary)
                          : "-"}
                      </td>
                    )}
                    <td className="px-4 py-3 text-right">
                      <EmployeeActions 
                        employee={employee} 
                        currentUserRole={currentUserRole}
                        onDelete={setEmployeeToDelete}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EmployeePagination 
        page={pagination.page} 
        total={pagination.total} 
        totalPages={pagination.totalPages} 
      />

      <DeleteEmployeeDialog 
        employee={employeeToDelete} 
        onOpenChange={(open) => {
          if (!open) setEmployeeToDelete(null);
        }}
      />
    </div>
  );
}
