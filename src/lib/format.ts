export const fmtUSD = (n: number, opts?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    ...opts,
  }).format(n);

export const fmtNum = (n: number, opts?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat('en-US', opts).format(n);

export const fmtPct = (n: number, digits = 1) =>
  `${n >= 0 ? '+' : ''}${n.toFixed(digits)}%`;

export const fmtCompact = (n: number) =>
  new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n);

export const fmtDateShort = (d: Date | string) => {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const fmtTime = (d: Date | string) => {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export const relativeHours = (hours: number) => {
  if (hours < 0) return `${Math.abs(Math.round(hours))}h ago`;
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 24) return `${Math.round(hours)}h`;
  return `${Math.round(hours / 24)}d`;
};
