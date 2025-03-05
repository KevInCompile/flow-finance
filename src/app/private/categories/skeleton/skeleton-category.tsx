export default function SkeletonCategory () {
  return (
    Array.from({ length: 3 }).map((_, index) => (
      <div
        key={`skeleton-${index}`}
        className="bg-background rounded-lg p-4 flex items-center shadow-md animate-pulse"
      >
        <div
          className="w-10 h-10 rounded-full mr-3 bg-gray-700"
        ></div>
        <div className="flex-1">
          <div className="h-5 bg-gray-700 rounded w-3/4"></div>
        </div>
        <div className="flex space-x-2">
          <div className="w-5 h-5 bg-gray-700 rounded"></div>
          <div className="w-5 h-5 bg-gray-700 rounded"></div>
        </div>
      </div>
    ))
  )
}
