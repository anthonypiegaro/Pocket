import { Filter } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-6 z-10 relative">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-1">
          <Skeleton className="relative max-sm:w-full sm:flex-1 h-9 rounded-md" />
          <Skeleton className="h-9 w-full sm:w-25 shrink-0" />
        </div>
        <div className="sticky top-0 z-40 py-4 flex flex-wrap gap-2 items-center backdrop-blur-sm">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Skeleton className="h-9 w-15" />
          <Skeleton className="h-9 w-15" />
          <Skeleton className="h-9 w-15" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => {
            return (
              <Skeleton key={i} className="h-42 rounded-xl shadow-sm max-w-full w-full" />
            )
          })}
        </div>
      </div>
    </div>
  )
}