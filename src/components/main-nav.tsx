import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Waves } from 'lucide-react';
import { navigationItems } from '@/config/navigation';

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      <Link to="/dashboard" className="flex items-center gap-2 mr-6">
        <Waves className="h-6 w-6 text-orange-500" />
        <span className="font-bold font-headline">ClarityFlow</span>
      </Link>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary flex items-center',
              pathname === item.path ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <Icon className="mr-2 h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
