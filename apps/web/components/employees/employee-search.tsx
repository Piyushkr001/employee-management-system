"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function EmployeeSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") || "");

  // Sync URL to input if URL changes externally
  useEffect(() => {
    setValue(searchParams.get("search") || "");
  }, [searchParams.get("search")]);

  // Debounced update to URL
  useEffect(() => {
    if (value === (searchParams.get("search") || "")) {
      return;
    }
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      params.set("page", "1"); // reset page on search
      router.replace(`?${params.toString()}`);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeout);
  }, [value, router, searchParams]);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search employees..."
        className="pl-8"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
