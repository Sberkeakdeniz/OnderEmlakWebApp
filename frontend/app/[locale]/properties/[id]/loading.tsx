import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
        <span>/</span>
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="aspect-video rounded-lg bg-muted animate-pulse" />
        </div>
        <div className="rounded-lg bg-muted animate-pulse h-80" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg bg-muted animate-pulse h-48" />
          <div className="rounded-lg bg-muted animate-pulse h-40" />
        </div>
        <div className="rounded-lg bg-muted animate-pulse h-32" />
      </div>
    </div>
  );
}
