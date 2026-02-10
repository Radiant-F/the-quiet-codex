export default function BlobSVG({
  className,
  color,
  opacity = 0.15,
  style,
}: {
  className?: string;
  color: string;
  opacity?: number;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        fill={color}
        fillOpacity={opacity}
        d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.2,-1.1C86.3,14.1,80,28.2,71.1,39.7C62.2,51.2,50.7,60.1,38,67.3C25.3,74.5,11.3,80,-3.8,85.6C-18.9,91.2,-37.8,96.9,-51.1,90.2C-64.4,83.5,-72.1,64.4,-78.6,46.6C-85.1,28.8,-90.4,12.3,-88.2,2.7C-86,-6.9,-76.3,-19.9,-67.8,-33.7C-59.3,-47.5,-52,-62.1,-40.3,-70.7C-28.6,-79.3,-14.3,-81.9,0.8,-83.3C15.9,-84.7,31.8,-84.8,44.7,-76.4Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}
