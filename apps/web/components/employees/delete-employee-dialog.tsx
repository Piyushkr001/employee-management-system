"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EmployeeDto, employeeApi } from "@/features/employees/employee.api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface DeleteEmployeeDialogProps {
  employee: EmployeeDto | null;
  onOpenChange: (open: boolean) => void;
}

export function DeleteEmployeeDialog({ employee, onOpenChange }: DeleteEmployeeDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!employee) return;

    setIsDeleting(true);
    try {
      await employeeApi.softDelete(employee.id);
      toast.success("Employee soft deleted successfully");
      onOpenChange(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete employee");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={!!employee} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will soft-delete <strong>{employee?.name}</strong> ({employee?.employeeCode}). 
            They will lose login access immediately and be hidden from active lists.
            This action can be reverted by database administrators.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Soft Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
