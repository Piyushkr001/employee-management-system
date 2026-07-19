import { Skeleton } from "@/components/ui/skeleton";

export default function EmployeesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-[200px]" />
          <Skeleton className="h-5 w-[300px]" />
        </div>
        <Skeleton className="h-10 w-[140px]" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-[300px]" />
        <Skeleton className="h-10 w-[400px]" />
      </div>

      <div className="rounded-md border">
        <div className="h-12 border-b px-4 py-3">
          <div className="flex gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={`h-${i}`} className="h-6 w-[100px]" />
            ))}
          </div>
        </div>
        <div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={`r-${i}`} className="flex gap-4 border-b px-4 py-4 last:border-0">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-3 w-[100px]" />
              </div>
              <Skeleton className="h-8 w-[100px]" />
              <Skeleton className="h-8 w-[100px]" />
              <Skeleton className="h-8 w-[100px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
