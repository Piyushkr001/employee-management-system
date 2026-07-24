"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { 
  updateEmployeeSchema,
  UserRole 
} from "@empnexa/shared";
import { employeeApi, EmployeeDto } from "@/features/employees/employee.api";
import { z } from "zod";

type EditEmployeeFormInput = z.input<typeof updateEmployeeSchema>;
type EditEmployeePayload = z.output<typeof updateEmployeeSchema>;

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

import { ManagerSelect } from "./manager-select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EditEmployeeFormProps {
  employee: EmployeeDto;
  currentUserRole: UserRole;
}

export function EditEmployeeForm({ employee, currentUserRole }: EditEmployeeFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EditEmployeeFormInput>({
    resolver: zodResolver(updateEmployeeSchema),
    defaultValues: {
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      designation: employee.designation,
      salary: employee.salary ?? 0,
      status: employee.status as "active" | "inactive",
      role: employee.role as "employee" | "hr_manager" | "super_admin",
      joiningDate: employee.joiningDate,
      profileImageUrl: employee.profileImageUrl ?? "",
      managerId: employee.managerId ?? "",
    },
  });

  const { dirtyFields } = form.formState;

  const onSubmit = async (data: EditEmployeeFormInput) => {
    setIsLoading(true);
    try {
      const payload: Partial<EditEmployeeFormInput> = {};
      
      Object.keys(dirtyFields).forEach(key => {
        Object.assign(payload, { [key]: data[key as keyof EditEmployeeFormInput] });
      });

      if (Object.keys(payload).length === 0) {
        toast.info("No changes to save");
        setIsLoading(false);
        return;
      }
      
      await employeeApi.update(employee.id, payload as Partial<EditEmployeePayload>);
      toast.success("Employee updated successfully");
      
      router.replace("/employees");
      router.refresh();
    } catch (error: Error | any) {
      if (error.fieldErrors) {
        Object.entries(error.fieldErrors).forEach(([field, messages]) => {
          form.setError(field as keyof EditEmployeeFormInput, { message: (messages as string[])[0] });
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

          <div className="space-y-2">
            <FormLabel>Employee Code</FormLabel>
            <Input value={employee.employeeCode} disabled readOnly className="bg-muted" />
          </div>

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
                    min="0"
                    step="0.01"
                    placeholder="60000" 
                    disabled={isLoading || currentUserRole === "employee"} 
                    {...field} 
                    onChange={e => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)} 
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
                <FormLabel>Manager (Optional)</FormLabel>
                <ManagerSelect 
                  value={field.value || "none"}
                  onChange={field.onChange}
                  excludeEmployeeId={employee.id}
                  disabled={isLoading}
                  currentManager={employee.manager}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profileImageUrl"
            render={({ field }) => (
              <FormItem className="col-span-full flex flex-col md:flex-row items-center gap-4">
                <div>
                  <FormLabel>Profile Image URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/image.jpg" 
                      disabled={isLoading} 
                      {...field} 
                      className="mt-2 w-full md:w-[400px]"
                    />
                  </FormControl>
                  <FormMessage />
                </div>
                <Avatar className="h-16 w-16 mt-2 md:mt-0">
                  <AvatarImage src={field.value || ""} alt="Preview" />
                  <AvatarFallback>{form.watch("name")?.substring(0, 2).toUpperCase() || "UN"}</AvatarFallback>
                </Avatar>
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
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
