import {
  Activity,
  Boxes,
  Command,
  Container,
  Crosshair,
  GanttChartSquare,
  Gauge,
  LineChart,
  Plug,
  ShieldAlert,
  Sparkles,
  Truck,
  Users,
  Workflow,
} from 'lucide-react';
import { ReactNode } from 'react';

export interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
  badge?: { text: string; tone: 'brand' | 'warning' | 'danger' | 'success' };
  group: 'Demo Path' | 'Operations' | 'Intelligence' | 'Platform';
}

// Sidebar reorganized for the live call:
// • "Demo Path" leads — exactly the 5 screens the presenter walks through
// • Operations + Intelligence are deep-dive support
// • Platform is collapsed at the bottom
export const NAV: NavItem[] = [
  // Demo path (in walk-through order)
  {
    group: 'Demo Path',
    label: 'Executive Dashboard',
    path: '/',
    icon: <Gauge className="h-4 w-4" />,
  },
  {
    group: 'Demo Path',
    label: 'Customer Portal',
    path: '/customer-portal',
    icon: <Users className="h-4 w-4" />,
  },
  {
    group: 'Demo Path',
    label: 'Container Visibility',
    path: '/containers',
    icon: <Container className="h-4 w-4" />,
  },
  {
    group: 'Demo Path',
    label: 'Dispatch Planning',
    path: '/dispatch',
    icon: <Truck className="h-4 w-4" />,
  },
  {
    group: 'Demo Path',
    label: 'Margin Optimization',
    path: '/margin',
    icon: <Crosshair className="h-4 w-4" />,
    badge: { text: 'AI', tone: 'brand' },
  },
  {
    group: 'Demo Path',
    label: 'Multi-Entity Comparison',
    path: '/entities',
    icon: <GanttChartSquare className="h-4 w-4" />,
  },

  // Deep-dive operations
  {
    group: 'Operations',
    label: 'Command Center',
    path: '/command-center',
    icon: <Command className="h-4 w-4" />,
    badge: { text: '7 live', tone: 'warning' },
  },
  {
    group: 'Operations',
    label: 'Warehouse Intelligence',
    path: '/warehouse',
    icon: <Boxes className="h-4 w-4" />,
  },
  {
    group: 'Operations',
    label: 'Exception Management',
    path: '/exceptions',
    icon: <ShieldAlert className="h-4 w-4" />,
    badge: { text: '12', tone: 'danger' },
  },

  // Intelligence
  {
    group: 'Intelligence',
    label: 'Demand Forecasting',
    path: '/forecasting',
    icon: <Activity className="h-4 w-4" />,
  },
  {
    group: 'Intelligence',
    label: 'Analytics Workbench',
    path: '/analytics',
    icon: <LineChart className="h-4 w-4" />,
  },

  // Platform — bottom
  {
    group: 'Platform',
    label: 'Workflow Automation',
    path: '/automation',
    icon: <Workflow className="h-4 w-4" />,
  },
  {
    group: 'Platform',
    label: 'Integrations',
    path: '/integrations',
    icon: <Plug className="h-4 w-4" />,
  },
];

export const GROUPS: NavItem['group'][] = [
  'Demo Path',
  'Operations',
  'Intelligence',
  'Platform',
];

export const BRAND = {
  name: 'Meridian',
  tagline: 'Logistics Intelligence',
  logo: <Sparkles className="h-4 w-4" />,
};
