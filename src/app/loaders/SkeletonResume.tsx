import ContentLoader from "react-content-loader";

export default function SkeletonResume() {
  return (
    <ContentLoader
      speed={2}
      width="100%"
      height={110}
      viewBox="0 0 240 120"
      backgroundColor="#333"
      foregroundColor="#f4f0f0"
    >
      <rect x="0" y="15" rx="5" ry="5" width="50%" height="10" />
      <rect x="0" y="45" rx="5" ry="5" width="90%" height="10" />
      <rect x="0" y="75" rx="5" ry="5" width="20%" height="10" />
    </ContentLoader>
  );
}
