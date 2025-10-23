import { Waves } from 'lucide-react';
import { ProtectedRoute } from '@/hooks/use-auth';
import { Link } from 'react-router';

export default function AuthContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col items-center justify-center bg-secondary p-4">
        <div className="absolute top-8 left-8">
          <Link to="/" className="flex items-center gap-2">
            <Waves className="h-6 w-6 text-orange-500" />
            <span className="font-bold font-headline">ClarityFlow</span>
          </Link>
        </div>
        {children}
      </div>
    </ProtectedRoute>
  );
}
