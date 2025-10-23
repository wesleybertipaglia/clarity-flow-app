import { MainNav } from '@/components/main-nav';
import { UserNav } from '@/components/user-nav';
import { ProtectedRoute } from '@/hooks/use-auth';

export default function AppContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen">
        <div className="border-b bg-background sticky top-0 z-50">
          <div className="flex h-16 items-center px-4 container mx-auto">
            <MainNav />
            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </div>
        <main className="container mx-auto flex-1 space-y-4 p-8 pt-6 overflow-auto scrollbar-hide">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
