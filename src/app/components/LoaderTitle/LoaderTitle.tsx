import ContentLoader from "react-content-loader"

const SkeletonTitle = () => (
  <ContentLoader 
    speed={2}
    width={400}
    height={30}
    viewBox="0 0 2000 150"
    backgroundColor="#242424"
    foregroundColor="#f4f0f0"
    className="rounded-md m-auto"
  >
    <rect x="67" y="26" rx="0" ry="0" width="100%" height="100%" />
  </ContentLoader>
)

export default SkeletonTitle

