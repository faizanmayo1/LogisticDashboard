import { TooltipProps } from 'recharts';

export function GlassTooltip({ active, payload, label }: TooltipProps<any, any>) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-hairline/[0.12] bg-ink-950/90 px-3 py-2 backdrop-blur shadow-xl">
      {label && (
        <div className="mb-1 text-[11px] uppercase tracking-wider text-ink-400 font-semibold">
          {label}
        </div>
      )}
      <div className="space-y-1">
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color || p.fill }} />
            <span className="text-ink-300">{p.name}</span>
            <span className="ml-auto mono text-ink-100 font-medium">
              {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
