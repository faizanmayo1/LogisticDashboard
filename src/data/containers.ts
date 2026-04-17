export type ContainerStatus =
  | 'At Port'
  | 'In Terminal'
  | 'Rail Ramp'
  | 'In Transit'
  | 'At Warehouse'
  | 'Empty Return';

export interface Container {
  id: string;
  number: string;
  status: ContainerStatus;
  carrier: string;
  steamship: string;
  customer: string;
  destination: string;
  origin: string;
  etaHours: number;
  freeTimeHoursLeft: number;
  perDiemRiskUSD: number;
  demurrageRiskUSD: number;
  lastEvent: string;
  lastEventTime: string;
  temp?: number;
  size: '20ft' | '40ft' | '40HC' | '45HC';
  priority: 'standard' | 'urgent' | 'critical';
}

export const CONTAINERS: Container[] = [
  {
    id: 'ctr-1',
    number: 'MSCU7349182',
    status: 'At Port',
    carrier: 'Westbound Drayage',
    steamship: 'MSC',
    customer: 'Halcyon Retail Group',
    origin: 'Port of Long Beach',
    destination: 'LAX-01',
    etaHours: 6,
    freeTimeHoursLeft: 14,
    perDiemRiskUSD: 1200,
    demurrageRiskUSD: 2800,
    lastEvent: 'Discharged from vessel',
    lastEventTime: '2h ago',
    size: '40HC',
    priority: 'critical',
  },
  {
    id: 'ctr-2',
    number: 'MAEU9921033',
    status: 'Rail Ramp',
    carrier: 'PacRail Logistics',
    steamship: 'Maersk',
    customer: 'Crescent Foods',
    origin: 'Port of Savannah',
    destination: 'SAV-07',
    etaHours: 18,
    freeTimeHoursLeft: 36,
    perDiemRiskUSD: 0,
    demurrageRiskUSD: 0,
    lastEvent: 'Loaded onto rail',
    lastEventTime: '1h ago',
    temp: 34,
    size: '40ft',
    priority: 'standard',
  },
  {
    id: 'ctr-3',
    number: 'CMAU1180043',
    status: 'In Transit',
    carrier: 'Atlas Intermodal',
    steamship: 'CMA CGM',
    customer: 'Northwind Consumer',
    origin: 'Oakland Terminal',
    destination: 'OAK-02',
    etaHours: 3,
    freeTimeHoursLeft: 22,
    perDiemRiskUSD: 0,
    demurrageRiskUSD: 0,
    lastEvent: 'Pickup from terminal',
    lastEventTime: '45m ago',
    size: '40HC',
    priority: 'standard',
  },
  {
    id: 'ctr-4',
    number: 'EGHU4442019',
    status: 'At Port',
    carrier: 'Harbor Point Dray',
    steamship: 'Evergreen',
    customer: 'Polaris Industrial',
    origin: 'Port of Newark',
    destination: 'NYC-03',
    etaHours: 12,
    freeTimeHoursLeft: 4,
    perDiemRiskUSD: 2400,
    demurrageRiskUSD: 5600,
    lastEvent: 'Awaiting terminal appointment',
    lastEventTime: '5h ago',
    size: '45HC',
    priority: 'critical',
  },
  {
    id: 'ctr-5',
    number: 'HLXU6631112',
    status: 'At Warehouse',
    carrier: 'Westbound Drayage',
    steamship: 'Hapag-Lloyd',
    customer: 'Orion Apparel',
    origin: 'Port of Long Beach',
    destination: 'LAX-01',
    etaHours: 0,
    freeTimeHoursLeft: 26,
    perDiemRiskUSD: 0,
    demurrageRiskUSD: 0,
    lastEvent: 'Arrived at dock 14',
    lastEventTime: '22m ago',
    size: '40HC',
    priority: 'urgent',
  },
  {
    id: 'ctr-6',
    number: 'ONEU7780012',
    status: 'In Terminal',
    carrier: 'PacRail Logistics',
    steamship: 'ONE',
    customer: 'Vector Home Goods',
    origin: 'Port of Oakland',
    destination: 'OAK-02',
    etaHours: 26,
    freeTimeHoursLeft: 30,
    perDiemRiskUSD: 0,
    demurrageRiskUSD: 0,
    lastEvent: 'Customs hold released',
    lastEventTime: '40m ago',
    size: '20ft',
    priority: 'standard',
  },
  {
    id: 'ctr-7',
    number: 'ZIMU9933400',
    status: 'At Port',
    carrier: 'Harbor Point Dray',
    steamship: 'ZIM',
    customer: 'Halcyon Retail Group',
    origin: 'Port of Long Beach',
    destination: 'LAX-01',
    etaHours: 9,
    freeTimeHoursLeft: 8,
    perDiemRiskUSD: 900,
    demurrageRiskUSD: 1600,
    lastEvent: 'Dual-transaction blocked',
    lastEventTime: '1h ago',
    size: '40HC',
    priority: 'urgent',
  },
  {
    id: 'ctr-8',
    number: 'TCLU2217731',
    status: 'Empty Return',
    carrier: 'Westbound Drayage',
    steamship: 'MSC',
    customer: 'Halcyon Retail Group',
    origin: 'LAX-01',
    destination: 'Port of Long Beach',
    etaHours: 2,
    freeTimeHoursLeft: 0,
    perDiemRiskUSD: 0,
    demurrageRiskUSD: 0,
    lastEvent: 'Empty returned',
    lastEventTime: 'Scheduled 14:00',
    size: '40HC',
    priority: 'standard',
  },
];
