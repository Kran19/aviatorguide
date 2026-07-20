import { Skeleton } from "@/components/ui/skeleton"

export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* 3D ambient backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full -z-10" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full -z-10" />

      <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 pt-4 pb-12">
        <Skeleton className="h-8 w-32 rounded-full mb-4" />

        <article className="glass-card p-8 md:p-12 rounded-3xl border border-white/10 dark:border-white/5 shadow-2xl relative overflow-hidden backdrop-blur-xl bg-background/60">
          
          <div className="mb-8 text-center flex flex-col items-center">
            <div className="flex gap-2 mb-6">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-12 md:h-16 w-full max-w-3xl mb-6 rounded-xl" />
            <Skeleton className="h-6 w-48 rounded-md" />
          </div>

          <Skeleton className="w-full max-w-4xl mx-auto h-[400px] md:h-[500px] rounded-2xl mb-12" />

          <div className="max-w-4xl mx-auto space-y-4">
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-6 w-11/12 rounded-md" />
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-6 w-4/5 rounded-md" />
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-6 w-5/6 rounded-md" />
            
            <br />
            
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-6 w-10/12 rounded-md" />
            <Skeleton className="h-6 w-full rounded-md" />
          </div>

          {/* Author Details Skeleton */}
          <div className="max-w-4xl mx-auto mt-16 pt-8 border-t border-border/50 flex flex-col sm:flex-row gap-6 items-start">
            <Skeleton className="w-20 h-20 rounded-full shrink-0" />
            <div className="flex-1 w-full">
              <Skeleton className="h-6 w-32 mb-2 rounded-md" />
              <Skeleton className="h-4 w-24 mb-4 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
