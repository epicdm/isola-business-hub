type Props = {
  values: number[];
  height?: number;
  className?: string;
  /** "line" gradient strokes, "bars" mini bar chart */
  variant?: "line" | "bars";
  stroke?: string;
  fill?: string;
};

export default function Sparkline({
  values,
  height = 40,
  variant = "line",
  className,
  stroke = "var(--color-success)",
  fill = "var(--color-success)",
}: Props) {
  if (!values.length) return null;
  const w = 200;
  const h = height;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(1, max - min);
  const stepX = w / Math.max(1, values.length - 1);

  if (variant === "bars") {
    const bw = w / values.length - 2;
    return (
      <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none">
        {values.map((v, i) => {
          const bh = ((v - min) / span) * (h - 4) + 2;
          return (
            <rect
              key={i}
              x={i * (bw + 2)}
              y={h - bh}
              width={bw}
              height={bh}
              rx={1}
              fill={fill}
              opacity={0.3 + (0.7 * (v - min)) / span}
            />
          );
        })}
      </svg>
    );
  }

  const points = values
    .map((v, i) => `${i * stepX},${h - ((v - min) / span) * (h - 4) - 2}`)
    .join(" ");
  const areaPath = `M0,${h} L${points.replace(/ /g, " L")} L${w},${h} Z`;
  const gradId = `sg-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity="0.45" />
          <stop offset="100%" stopColor={fill} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <polyline points={points} fill="none" stroke={stroke} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
