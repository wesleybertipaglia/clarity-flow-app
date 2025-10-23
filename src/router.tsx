import { Route, Routes } from 'react-router-dom';
import Home from '@/pages/home/page';
import Dashboard from '@/pages/dashboard/page';
import Appointments from '@/pages/appointments/page';
import Chat from '@/pages/chat/page';
import Employees from '@/pages/employees/page';
import Onboarding from '@/pages/onboarding/page';
import Settings from '@/pages/settings/page';
import Tasks from '@/pages/tasks/page';
import Sales from '@/pages/sales/page';
import AppLayout from '@/layouts/AppLayout';
import { AuthProvider } from '@/hooks/use-auth';

export default function Router() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />

        {/* Protected routes */}
        <Route path="/onboarding" element={<Onboarding />} />
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />
        <Route
          path="/appointments"
          element={
            <AppLayout>
              <Appointments />
            </AppLayout>
          }
        />
        <Route
          path="/chat"
          element={
            <AppLayout>
              <Chat />
            </AppLayout>
          }
        />

        <Route
          path="/employees"
          element={
            <AppLayout>
              <Employees />
            </AppLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <AppLayout>
              <Settings />
            </AppLayout>
          }
        />
        <Route
          path="/tasks"
          element={
            <AppLayout>
              <Tasks />
            </AppLayout>
          }
        />
        <Route
          path="/sales"
          element={
            <AppLayout>
              <Sales />
            </AppLayout>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </AuthProvider>
  );
}
