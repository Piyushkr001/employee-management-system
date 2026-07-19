"use client";

import { useState, useEffect, useRef } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { employeeApi } from "@/features/employees/employee.api";
import { ManagerOptionDto } from "@empnexa/shared";

interface ManagerSelectProps {
  value: string;
  onChange: (value: string) => void;
  excludeEmployeeId?: string;
  disabled?: boolean;
  currentManager?: { id: string; name: string; employeeCode: string; designation: string } | null;
}

export function ManagerSelect({ value, onChange, excludeEmployeeId, disabled, currentManager }: ManagerSelectProps) {
  const [open, setOpen] = useState(false);
  const [managers, setManagers] = useState<ManagerOptionDto[]>(currentManager ? [currentManager as any] : []);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();
    const currentRequestId = ++requestIdRef.current;

    const loadManagers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await employeeApi.getManagerOptions(excludeEmployeeId, search, controller.signal);
        if (currentRequestId === requestIdRef.current) {
          setManagers((res as any).data?.managers || []);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        if (currentRequestId === requestIdRef.current) {
          setError("Failed to load managers");
        }
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    };

    const timeoutId = setTimeout(loadManagers, 300);
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [search, open, excludeEmployeeId]);

  const selectedManager = managers.find((m) => m.id === value) || (currentManager?.id === value ? currentManager : null);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger 
        className={cn(buttonVariants({ variant: "outline" }), "w-full justify-between font-normal")}
        disabled={disabled}
      >
        {value === "none" ? "No manager" : (selectedManager ? `${selectedManager.name} (${selectedManager.employeeCode})` : (value ? "Loading..." : "Select manager..."))}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Search manager..." 
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {isLoading && <div className="p-4 text-sm text-center text-muted-foreground">Loading...</div>}
            {error && <div className="p-4 text-sm text-center text-destructive">{error}</div>}
            {!isLoading && !error && managers.length === 0 && (
              <CommandEmpty>No manager found.</CommandEmpty>
            )}
            <CommandGroup>
              <CommandItem
                value="none"
                onSelect={() => {
                  onChange("none");
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === "none" ? "opacity-100" : "opacity-0"
                  )}
                />
                No manager
              </CommandItem>
              {!isLoading && managers.map((manager) => (
                <CommandItem
                  key={manager.id}
                  value={manager.id}
                  onSelect={() => {
                    onChange(manager.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === manager.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {manager.name} ({manager.employeeCode}) - {manager.designation}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
