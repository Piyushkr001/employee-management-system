"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createEmployeeSchema, CreateEmployeeInput, UpdateEmployeeInput, UserRole } from "@empnexa/shared";
import { employeeApi, EmployeeDto } from "@/features/employees/employee.api";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { PasswordInput } from "../auth/password-input";

interface EmployeeFormProps {
  initialData?: EmployeeDto;
  currentUserRole: UserRole;
}

export function EmployeeForm({ initialData, currentUserRole }: EmployeeFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!initialData;

  const defaultValues: Partial<CreateEmployeeInput> = initialData ? {
    name: initialData.name,
    email: initialData.email,
    employeeCode: initialData.employeeCode,
    phone: initialData.phone,
    department: initialData.department,
    designation: initialData.designation,
    salary: initialData.salary || 0,
    status: initialData.status as any,
    role: initialData.role as any,
    joiningDate: initialData.joiningDate,
    profileImageUrl: initialData.profileImageUrl || undefined,
    managerId: initialData.managerId || undefined,
  } : {
    name: "",
    email: "",
    password: "",
    employeeCode: "",
    phone: "",
    department: "",
    designation: "",
    salary: 0,
    status: "active",
    role: "employee",
    joiningDate: new Date().toISOString().split("T")[0],
  };

  const form = useForm<CreateEmployeeInput>({
    resolver: zodResolver(createEmployeeSchema) as any,
    defaultValues: defaultValues as any,
  });

  const onSubmit = async (data: CreateEmployeeInput) => {
    setIsLoading(true);
    try {
      if (isEditing) {
        // Exclude password and un-editable fields for edit
        const { password, employeeCode, email, ...updateData } = data;
        
        // Only include email/code if they actually changed (or let backend handle it, but updateSchema omits password)
        const payload: UpdateEmployeeInput = { ...updateData };
        if (email !== initialData.email) payload.email = email;
        if (employeeCode !== initialData.employeeCode) payload.employeeCode = employeeCode;
        
        await employeeApi.update(initialData.id, payload);
        toast.success("Employee updated successfully");
      } else {
        await employeeApi.create(data);
        toast.success("Employee created successfully");
      }
      router.push("/employees");
      router.refresh();
    } catch (error: any) {
      if (error.fieldErrors) {
        Object.entries(error.fieldErrors).forEach(([field, messages]) => {
          form.setError(field as any, { message: (messages as string[])[0] });
        });
      } else {
        toast.error(error.message || "Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl><Input placeholder="John Doe" disabled={isLoading} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl><Input placeholder="john@empnexa.com" type="email" disabled={isLoading} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="employeeCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee Code</FormLabel>
                <FormControl><Input placeholder="EMP001" disabled={isLoading || isEditing} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isEditing && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temporary Password</FormLabel>
                  <FormControl><PasswordInput placeholder="••••••••" disabled={isLoading} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl><Input placeholder="+1234567890" disabled={isLoading} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl><Input placeholder="Engineering" disabled={isLoading} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation</FormLabel>
                <FormControl><Input placeholder="Software Engineer" disabled={isLoading} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary (₹)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="60000" 
                    disabled={isLoading || currentUserRole === "employee"} 
                    {...field} 
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="joiningDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Joining Date</FormLabel>
                <FormControl>
                  <Input type="date" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="hr_manager">HR Manager</SelectItem>
                    {currentUserRole === "super_admin" && (
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="managerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manager ID (Optional)</FormLabel>
                <FormControl><Input placeholder="UUID of manager" disabled={isLoading} value={field.value || ""} onChange={field.onChange} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Save Changes" : "Create Employee"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
