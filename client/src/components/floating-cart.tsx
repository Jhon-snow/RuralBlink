import { ShoppingCart } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useLocation } from 'wouter';

export default function FloatingCart() {
  const [, setLocation] = useLocation();
  const { cartItemCount } = useStore();
  const count = cartItemCount();

  if (count === 0) return null;

  return (
    <button
      onClick={() => setLocation('/cart')}
      className="fixed bottom-20 right-4 z-40 w-14 h-14 bg-accent text-accent-foreground rounded-full shadow-lg flex items-center justify-center bounce-animation hover:shadow-xl transition-shadow"
      data-testid="floating-cart-button"
    >
      <ShoppingCart className="w-6 h-6" />
      <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center font-bold">
        {count}
      </span>
    </button>
  );
}
