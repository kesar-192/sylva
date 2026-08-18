export const Skeleton = ({ className = "", style }) => (
  <div className={`skeleton rounded-lg ${className}`} style={style} />
);

export const SkeletonCircle = ({ size = 40, className = "" }) => (
  <div
    className={`skeleton rounded-full ${className}`}
    style={{ width: size, height: size }}
  />
);

export const FeedSkeleton = () => (
  <div className="space-y-6">
    <div className="glass rounded-3xl overflow-hidden">
      <Skeleton className="h-28 sm:h-36 rounded-none" />
      <div className="px-5 sm:px-8 pb-6">
        <div className="flex items-end gap-4 -mt-10">
          <SkeletonCircle size={88} className="border-4 border-ink" />
          <div className="pb-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-2 w-full mt-6" />
        <div className="flex gap-2 mt-4">
          <Skeleton className="h-7 w-32 rounded-full" />
          <Skeleton className="h-7 w-40 rounded-full" />
        </div>
      </div>
    </div>

    <div className="glass rounded-2xl p-4 sm:p-5 flex gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <SkeletonCircle size={56} />
          <Skeleton className="h-2.5 w-10" />
        </div>
      ))}
    </div>

    {Array.from({ length: 2 }).map((_, i) => (
      <div key={i} className="glass rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 pt-4">
          <SkeletonCircle size={36} />
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-2.5 w-14" />
          </div>
        </div>
        <Skeleton className="h-4 w-3/4 mx-4 mt-4" />
        <Skeleton className="h-48 sm:h-56 mx-4 mt-3 rounded-xl" />
        <div className="flex gap-5 px-4 py-3.5">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
        </div>
      </div>
    ))}
  </div>
);

export const MasonrySkeleton = () => (
  <div className="masonry columns-2 sm:columns-3 lg:columns-4">
    {[220, 300, 260, 340, 200, 280, 320, 240, 260, 300].map((h, i) => (
      <Skeleton key={i} className="w-full rounded-xl" style={{ height: h }} />
    ))}
  </div>
);
