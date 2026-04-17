import { Area, AreaChart, ResponsiveContainer } from 'recharts';

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  gradientId?: string;
}

export function Sparkline({
  data,
  color = '#4d95ff',
  height = 40,
  gradientId = 'sparkGradient',
}: SparklineProps) {
  const chartData = data.map((v, i) => ({ i, v }));
  const id = `${gradientId}-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.55} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#${id})`}
          isAnimationActive
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
