"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileUpdateSchema, ProfileUpdateInput } from "@empnexa/shared";
import { employeeApi } from "@/features/employees/employee.api";
import { useRouter } from "next/navigation";

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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileFormProps {
  initialData: any;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema) as any,
    defaultValues: {
      phone: initialData.phone || "",
      profileImageUrl: initialData.profileImageUrl || "",
    },
  });
  
  const { dirtyFields } = form.formState;

  const onSubmit = async (data: ProfileUpdateInput) => {
    setIsLoading(true);
    try {
      const payload: Partial<ProfileUpdateInput> = {};
      Object.keys(dirtyFields).forEach(key => {
        payload[key as keyof ProfileUpdateInput] = data[key as keyof ProfileUpdateInput] as any;
      });

      if (Object.keys(payload).length === 0) {
        toast.info("No changes to save");
        setIsLoading(false);
        return;
      }
      
      await employeeApi.update(initialData.id, payload as any);
      toast.success("Profile updated successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile Details</CardTitle>
        <CardDescription>Update your contact information.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1234567890" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profileImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/avatar.jpg" disabled={isLoading} value={field.value || ""} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
