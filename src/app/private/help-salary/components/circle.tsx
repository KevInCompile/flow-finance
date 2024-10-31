export default function CirclePercentage({
  percentage,
  color,
}: {
  percentage: number;
  color: string;
}) {
  const rotation = (percentage / 100) * 180;
  return (
    <div
      className="circle-wrap"
      style={{ "--rotation": `${rotation}deg`, "--color": `${color}` }}
    >
      <div className="circle">
        <div className="mask full">
          <div className="fill"></div>
        </div>
        <div className="mask half">
          <div className="fill"></div>
        </div>
        <div className="inside-circle"> {percentage ?? 0}% </div>
      </div>
    </div>
  );
}
