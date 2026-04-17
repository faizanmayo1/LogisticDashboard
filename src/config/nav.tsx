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
  group: 'Overview' | 'Operations' | 'Intelligence' | 'Customers & Entities' | 'Platform';
}

// Standard product navigation — grouped the way real users would expect.
// Demo affordances live in the Presenter Dock, not in the nav.
export const NAV: NavItem[] = [
  {
    group: 'Overview',
    label: 'Executive Dashboard',
    path: '/',
    icon: <Gauge className="h-4 w-4" />,
  },
  {
    group: 'Overview',
    label: 'Command Center',
    path: '/command-center',
    icon: <Command className="h-4 w-4" />,
    badge: { text: '7 live', tone: 'warning' },
  },
  {
    group: 'Operations',
    label: 'Container Visibility',
    path: '/containers',
    icon: <Container className="h-4 w-4" />,
  },
  {
    group: 'Operations',
    label: 'Warehouse Intelligence',
    path: '/warehouse',
    icon: <Boxes className="h-4 w-4" />,
  },
  {
    group: 'Operations',
    label: 'Dispatch Planning',
    path: '/dispatch',
    icon: <Truck className="h-4 w-4" />,
  },
  {
    group: 'Operations',
    label: 'Exception Management',
    path: '/exceptions',
    icon: <ShieldAlert className="h-4 w-4" />,
    badge: { text: '12', tone: 'danger' },
  },
  {
    group: 'Intelligence',
    label: 'Demand Forecasting',
    path: '/forecasting',
    icon: <Activity className="h-4 w-4" />,
  },
  {
    group: 'Intelligence',
    label: 'Margin Optimization',
    path: '/margin',
    icon: <Crosshair className="h-4 w-4" />,
    badge: { text: 'AI', tone: 'brand' },
  },
  {
    group: 'Intelligence',
    label: 'Analytics Workbench',
    path: '/analytics',
    icon: <LineChart className="h-4 w-4" />,
  },
  {
    group: 'Customers & Entities',
    label: 'Customer Portal',
    path: '/customer-portal',
    icon: <Users className="h-4 w-4" />,
  },
  {
    group: 'Customers & Entities',
    label: 'Multi-Entity Comparison',
    path: '/entities',
    icon: <GanttChartSquare className="h-4 w-4" />,
  },
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
  'Overview',
  'Operations',
  'Intelligence',
  'Customers & Entities',
  'Platform',
];

export const BRAND = {
  name: 'Meridian',
  tagline: 'Logistics Intelligence',
  logo: <Sparkles className="h-4 w-4" />,
};
