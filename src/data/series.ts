// Deterministic time-series data for charts.

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const revenueVsMargin = months.slice(0, 10).map((m, i) => ({
  month: m,
  revenue: 4200 + i * 180 + (i % 3) * 90,
  margin: 14.2 + (i % 4) * 1.1 + Math.sin(i) * 0.8,
  forecast: 4200 + i * 200,
}));

export const shipmentVolume = Array.from({ length: 30 }).map((_, i) => ({
  day: `${i + 1}`,
  shipments: 380 + Math.round(Math.sin(i / 3) * 40 + (i % 5) * 6),
  delivered: 360 + Math.round(Math.sin(i / 3) * 36 + (i % 5) * 5),
  exceptions: 18 + Math.round(Math.sin(i / 2) * 5 + (i % 4) * 2),
}));

export const demandForecast = Array.from({ length: 12 }).map((_, i) => ({
  week: `W${i + 1}`,
  actual: i < 8 ? 1240 + Math.round(Math.sin(i / 2) * 120 + (i % 3) * 40) : undefined,
  forecast: 1260 + Math.round(Math.sin(i / 2) * 110 + i * 22),
  upper: 1360 + Math.round(Math.sin(i / 2) * 120 + i * 28),
  lower: 1120 + Math.round(Math.sin(i / 2) * 95 + i * 16),
}));

export const laneMargin = [
  { lane: 'LAX→PHX', margin: 21.4, volume: 1204 },
  { lane: 'LGB→LAS', margin: 17.8, volume: 980 },
  { lane: 'SAV→ATL', margin: 9.2, volume: 1530 },
  { lane: 'HOU→DAL', margin: 24.7, volume: 1180 },
  { lane: 'EWR→BOS', margin: 19.1, volume: 870 },
  { lane: 'OAK→SAC', margin: 23.0, volume: 640 },
  { lane: 'SAV→CLT', margin: 12.6, volume: 910 },
  { lane: 'CHI→MSP', margin: 20.8, volume: 720 },
];

export const exceptionMix = [
  { name: 'Free-time Risk', value: 32, color: '#fb7185' },
  { name: 'Dock Congestion', value: 18, color: '#fbbf24' },
  { name: 'SLA Risk', value: 22, color: '#4d95ff' },
  { name: 'Margin Erosion', value: 14, color: '#a78bfa' },
  { name: 'Carrier Outage', value: 8, color: '#22d3ee' },
  { name: 'Customs Hold', value: 6, color: '#34d399' },
];

export const dockActivity = Array.from({ length: 24 }).map((_, h) => ({
  hour: `${String(h).padStart(2, '0')}:00`,
  inbound: 4 + Math.round(Math.sin(h / 3) * 3 + (h % 5)),
  outbound: 3 + Math.round(Math.sin((h - 2) / 3) * 4 + (h % 4)),
  utilization: 48 + Math.round(Math.sin(h / 2) * 18 + h * 0.6),
}));

export const warehouseUtilization = [
  { wh: 'LAX-01', storage: 92, dock: 81, labor: 87 },
  { wh: 'OAK-02', storage: 74, dock: 67, labor: 71 },
  { wh: 'HOU-11', storage: 68, dock: 59, labor: 76 },
  { wh: 'SAV-07', storage: 95, dock: 88, labor: 93 },
  { wh: 'NYC-03', storage: 81, dock: 72, labor: 82 },
  { wh: 'CHI-05', storage: 77, dock: 64, labor: 79 },
];

export const marginWaterfall = [
  { stage: 'Linehaul Revenue', value: 1420, type: 'base' },
  { stage: 'Accessorials', value: 220, type: 'gain' },
  { stage: 'Fuel Surcharge', value: 180, type: 'gain' },
  { stage: 'Carrier Cost', value: -980, type: 'loss' },
  { stage: 'Detention', value: -140, type: 'loss' },
  { stage: 'Rehandle', value: -82, type: 'loss' },
  { stage: 'Net Margin', value: 618, type: 'total' },
];

export const entityCompare = [
  { metric: 'On-Time %', west: 94, south: 89, east: 91 },
  { metric: 'Margin %', west: 22.4, south: 18.6, east: 14.8 },
  { metric: 'Cost/Load', west: 68, south: 74, east: 86 },
  { metric: 'Dwell (h)', west: 14.5, south: 16.2, east: 19.1 },
  { metric: 'Exception %', west: 3.2, south: 4.1, east: 5.8 },
  { metric: 'CSAT', west: 92, south: 88, east: 85 },
];

// Customer margin erosion — drives Analytics Workbench's NL query result
export const customerMarginErosion = [
  { customer: 'Crescent Foods',         erosionUSD: 38_400, dwellMin: 4_820, accessorialUSD: 14_200, baseMargin: 18.4, currentMargin: 11.4 },
  { customer: 'Halcyon Retail Group',   erosionUSD: 24_100, dwellMin: 3_240, accessorialUSD: 9_800,  baseMargin: 22.1, currentMargin: 18.2 },
  { customer: 'Polaris Industrial',     erosionUSD: 18_600, dwellMin: 2_980, accessorialUSD: 7_400,  baseMargin: 19.2, currentMargin: 14.9 },
  { customer: 'Vector Home Goods',      erosionUSD: 9_200,  dwellMin: 1_120, accessorialUSD: 3_100,  baseMargin: 23.8, currentMargin: 19.8 },
  { customer: 'Orion Apparel',          erosionUSD: 6_800,  dwellMin: 980,   accessorialUSD: 2_100,  baseMargin: 26.4, currentMargin: 24.1 },
  { customer: 'Cedar & Bloom',          erosionUSD: 3_200,  dwellMin: 460,   accessorialUSD: 980,    baseMargin: 22.8, currentMargin: 21.3 },
  { customer: 'Northwind Consumer',     erosionUSD: 1_800,  dwellMin: 280,   accessorialUSD: 540,    baseMargin: 23.2, currentMargin: 22.6 },
];

// Demand pivot — by customer (3 large customers across 12 weeks)
export const demandByCustomer = Array.from({ length: 12 }).map((_, i) => ({
  week: `W${i + 1}`,
  Halcyon:    1840 + Math.round(Math.sin(i / 2) * 90 + i * 14),
  Crescent:   1620 + Math.round(Math.sin(i / 3) * 70 + i * 10),
  Northwind:  1210 + Math.round(Math.sin(i / 2.5) * 60 + i * 8),
}));

export const liveFeed = [
  { time: '14:32', text: 'Container MSCU7349182 · appointment confirmed at LAX-01 dock 14', tone: 'success' as const },
  { time: '14:28', text: 'EX-2431 escalated · Halcyon Retail Group notified', tone: 'warning' as const },
  { time: '14:21', text: 'AI dispatch plan applied · saved $2,140 on 8 outbound loads', tone: 'brand' as const },
  { time: '14:14', text: 'Driver Velasquez accepted load on LAX→PHX', tone: 'neutral' as const },
  { time: '14:02', text: 'Customs hold released for EGHU4442019', tone: 'success' as const },
  { time: '13:55', text: 'Redline Freight tender rejection · auto-retendered to Summit', tone: 'info' as const },
  { time: '13:44', text: 'SAV-07 dock 22 reached 95% utilization threshold', tone: 'warning' as const },
];
