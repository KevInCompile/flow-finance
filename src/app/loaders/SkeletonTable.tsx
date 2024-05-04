import ContentLoader from 'react-content-loader'

const SkeletonTable = () => (
  <ContentLoader
  width='100%'
  height={430}
  viewBox="0 0 1300 400"
  backgroundColor="#333"
  foregroundColor="#dbdbdb"
  speed={3}

>
  <rect x="4" y="8" rx="3" ry="3" width="8" height="317" />
  <rect x="7" y="317" rx="3" ry="3" width="1200" height="8" />
  <rect x="1200" y="9" rx="3" ry="3" width="7" height="313" />
  <rect x="5" y="8" rx="3" ry="3" width="1200" height="7" />
  <rect x="114" y="52" rx="6" ry="6" width="1050" height="15" />
  <circle cx="77" cy="60" r="15" />
  <rect x="116" y="105" rx="6" ry="6" width="1050" height="15" />
  <circle cx="78" cy="113" r="15" />
  <rect x="115" y="158" rx="6" ry="6" width="1050" height="15" />
  <circle cx="78" cy="166" r="15" />
  <rect x="117" y="211" rx="6" ry="6" width="1050" height="15" />
  <circle cx="79" cy="219" r="15" />
  <rect x="117" y="263" rx="6" ry="6" width="1050" height="15" />
  <circle cx="80" cy="271" r="15" />
</ContentLoader>
)


export default SkeletonTable