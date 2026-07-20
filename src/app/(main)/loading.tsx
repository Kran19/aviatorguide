import { Skeleton } from "@/components/ui/skeleton"

export default function MainLoading() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Hero Skeleton */}
      <div className="relative w-full h-[70vh] min-h-[600px] flex items-center justify-center bg-muted/10 overflow-hidden border-b border-border/50">
        <div className="flex flex-col items-center z-10 space-y-6 w-full max-w-4xl px-4">
          <Skeleton className="h-16 md:h-24 w-3/4 rounded-xl" />
          <Skeleton className="h-6 md:h-8 w-1/2 rounded-md" />
          <div className="flex gap-4 mt-8">
            <Skeleton className="h-12 w-32 rounded-md" />
            <Skeleton className="h-12 w-32 rounded-md" />
          </div>
        </div>
      </div>

      {/* Latest Drops Skeleton */}
      <section className="py-24 bg-muted/30 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <Skeleton className="h-12 w-64 mb-4" />
              <Skeleton className="h-6 w-48" />
            </div>
            <Skeleton className="h-10 w-32 hidden sm:block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-border/50 shadow-lg">
                <Skeleton className="h-56 w-full rounded-none" />
                <div className="p-6 flex flex-col flex-1">
                  <Skeleton className="h-7 w-full mb-3" />
                  <Skeleton className="h-7 w-4/5 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-6 flex-1" />
                  
                  <div className="mt-auto pt-4 flex justify-between items-center border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
