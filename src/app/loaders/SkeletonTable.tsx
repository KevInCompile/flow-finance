
const SkeletonTable = () => (
  <div className="w-full overflow-x-auto">
    {/* Table header */}
    <div className="p-4 border-b border-gray-800 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="h-5 bg-gray-700 rounded w-36"></div>
          <div className="h-5 bg-gray-700 rounded w-36"></div>
          <div className="h-5 bg-gray-700 rounded w-36"></div>
        </div>
      </div>
    </div>

    {/* Table body */}
    <div className="divide-y divide-gray-800">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={`skeleton-row-${index}`} className="p-4 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-700 h-4 w-4 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-32"></div>
            </div>
            <div>
              <div className="bg-gray-700 h-8 w-36 rounded-full"></div>
            </div>
            <div className="flex space-x-3">
              <div className="h-4 bg-gray-700 rounded w-24"></div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Table footer/pagination */}
    <div className="p-4 border-t border-gray-800 animate-pulse">
      <div className="flex justify-between space-x-2">
        <div className="h-4 bg-gray-700 rounded w-52"></div>
        <div className="h-4 bg-gray-700 rounded w-52"></div>
      </div>
    </div>
  </div>
)


export default SkeletonTable
