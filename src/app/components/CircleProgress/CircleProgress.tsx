import './circleprogress.css'

interface Props {
  progress: string
}

export default function CircleProgress (props: Props) {
  const {progress} = props
  return (
    <div className="container">
      <div className="progress">
        <h3>{progress}<span className='!text-sm'>%</span></h3>
      </div>
    </div>
  )
}
