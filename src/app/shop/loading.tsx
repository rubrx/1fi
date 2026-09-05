import { AppShell } from "@/components/ui/AppShell";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ShopLoading() {
  return (
    <AppShell>
      <main className="px-5 pt-5 pb-8 md:px-8 md:pt-8">
        <Skeleton className="h-56 sm:h-64 w-full rounded-card" />
        <div className="relative -mt-6 md:-mt-7 z-10">
          <Skeleton className="h-12 w-full rounded-pill" />
        </div>
        <div className="mt-6 space-y-5">
          <Skeleton className="h-12 w-full rounded-pill" />
          <Skeleton className="h-8 w-56" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                className="h-[380px] w-full rounded-card"
              />
            ))}
          </div>
        </div>
      </main>
    </AppShell>
  );
}
