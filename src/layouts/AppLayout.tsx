import AppContent from '@/components/app-content';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppContent>{children}</AppContent>;
}
