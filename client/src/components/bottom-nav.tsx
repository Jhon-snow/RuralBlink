import { Home, Grid3X3, Receipt, User } from 'lucide-react';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';

export default function BottomNav() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home', testId: 'nav-home' },
    { path: '/categories', icon: Grid3X3, label: 'Categories', testId: 'nav-categories' },
    { path: '/orders', icon: Receipt, label: 'Orders', testId: 'nav-orders' },
    { path: '/profile', icon: User, label: 'Profile', testId: 'nav-profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[480px] bg-background border-t border-border py-3 z-50" data-testid="bottom-nav">
      <div className="flex justify-around items-center px-4">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={cn(
                "flex flex-col items-center py-2 px-3 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
              data-testid={item.testId}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
