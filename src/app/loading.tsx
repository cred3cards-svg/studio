import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
             <Skeleton className="h-8 w-8 rounded-full" />
             <Skeleton className="h-6 w-24 ml-2" />
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
             <Skeleton className="h-8 w-32" />
          </div>
        </div>
      </header>
      <main className="flex-1 container py-8">
        <div className="space-y-8">
          <Skeleton className="h-32 w-full" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </main>
    </div>
  );
}
