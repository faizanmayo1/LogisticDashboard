import { Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ToastProvider } from '@/components/ui/Toast';
import { RequireAuth } from '@/components/auth/RequireAuth';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import ExecutiveDashboard from '@/pages/ExecutiveDashboard';
import CommandCenter from '@/pages/CommandCenter';
import ContainerVisibility from '@/pages/ContainerVisibility';
import WarehouseIntelligence from '@/pages/WarehouseIntelligence';
import DemandForecasting from '@/pages/DemandForecasting';
import MarginOptimization from '@/pages/MarginOptimization';
import DispatchPlanning from '@/pages/DispatchPlanning';
import ExceptionManagement from '@/pages/ExceptionManagement';
import CustomerPortal from '@/pages/CustomerPortal';
import MultiEntityComparison from '@/pages/MultiEntityComparison';
import AnalyticsWorkbench from '@/pages/AnalyticsWorkbench';
import WorkflowAutomation from '@/pages/WorkflowAutomation';
import IntegrationsOverview from '@/pages/IntegrationsOverview';

function ProtectedApp() {
  return (
    <RequireAuth>
      <AppShell>
        <Routes>
          <Route path="/" element={<ExecutiveDashboard />} />
          <Route path="/command-center" element={<CommandCenter />} />
          <Route path="/containers" element={<ContainerVisibility />} />
          <Route path="/warehouse" element={<WarehouseIntelligence />} />
          <Route path="/forecasting" element={<DemandForecasting />} />
          <Route path="/margin" element={<MarginOptimization />} />
          <Route path="/dispatch" element={<DispatchPlanning />} />
          <Route path="/exceptions" element={<ExceptionManagement />} />
          <Route path="/customer-portal" element={<CustomerPortal />} />
          <Route path="/entities" element={<MultiEntityComparison />} />
          <Route path="/analytics" element={<AnalyticsWorkbench />} />
          <Route path="/automation" element={<WorkflowAutomation />} />
          <Route path="/integrations" element={<IntegrationsOverview />} />
        </Routes>
      </AppShell>
    </RequireAuth>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<ProtectedApp />} />
      </Routes>
    </ToastProvider>
  );
}
