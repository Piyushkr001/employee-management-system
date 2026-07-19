"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { EmployeeDto } from "@/features/employees/employee.api";
import { UserRole } from "@empnexa/shared";

interface EmployeeActionsProps {
  employee: EmployeeDto;
  currentUserRole: UserRole;
  onDelete: (employee: EmployeeDto) => void;
}

export function EmployeeActions({ employee, currentUserRole, onDelete }: EmployeeActionsProps) {
  const router = useRouter();

  const canEdit = currentUserRole === "super_admin" || (currentUserRole === "hr_manager" && employee.role !== "super_admin");
  const canDelete = currentUserRole === "super_admin";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
        </DropdownMenuGroup>
        
        <DropdownMenuItem onClick={() => router.push(`/employees/${employee.id}`)}>
          <Eye className="mr-2 h-4 w-4" /> View Details
        </DropdownMenuItem>

        {canEdit && (
          <DropdownMenuItem onClick={() => router.push(`/employees/${employee.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" /> Edit Employee
          </DropdownMenuItem>
        )}

        {canDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(employee)}
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Soft Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
