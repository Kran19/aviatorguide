import { Skeleton } from "@/components/ui/skeleton"

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* 3D ambient backgrounds */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/20 blur-[150px] rounded-full -z-10" />
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 flex flex-col items-center">
          <Skeleton className="h-14 md:h-20 w-64 md:w-96 mb-4 rounded-xl" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto rounded-md" />
        </div>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-full flex flex-col overflow-hidden rounded-3xl border border-white/10 shadow-xl backdrop-blur-xl bg-background/40 relative">
              <Skeleton className="w-full h-56 rounded-none" />
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-6 w-16 rounded-md" />
                  <Skeleton className="h-6 w-20 rounded-md" />
                </div>
                <Skeleton className="h-8 w-full mb-3 rounded-md" />
                <Skeleton className="h-4 w-full mb-2 rounded-md" />
                <Skeleton className="h-4 w-4/5 mb-6 flex-1 rounded-md" />
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <Skeleton className="h-4 w-24 rounded-md" />
                  <Skeleton className="h-4 w-20 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
