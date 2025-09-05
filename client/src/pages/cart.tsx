import { ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/lib/store';

export default function Cart() {
  const [, setLocation] = useLocation();
  const { cart, updateCartItemQuantity, removeFromCart, cartTotal } = useStore();

  const subtotal = cartTotal();
  const deliveryFee = subtotal >= 20000 ? 0 : 3000; // Free delivery above ₹200
  const total = subtotal + deliveryFee;

  const formatPrice = (price: number) => `₹${(price / 100).toFixed(0)}`;

  if (cart.length === 0) {
    return (
      <div className="page-transition">
        <header className="bg-primary text-primary-foreground p-4 pt-12 sticky top-0 z-10">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              size="icon"
              className="mr-3 bg-primary-foreground/10 hover:bg-primary-foreground/20"
              onClick={() => setLocation('/')}
              data-testid="back-button"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-bold">Your Cart</h1>
          </div>
        </header>

        <div className="p-4 text-center py-12" data-testid="empty-cart">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some products to get started</p>
          <Button onClick={() => setLocation('/')} data-testid="continue-shopping">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition pb-24">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 pt-12 sticky top-0 z-10">
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="mr-3 bg-primary-foreground/10 hover:bg-primary-foreground/20"
            onClick={() => setLocation('/')}
            data-testid="back-button"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">Your Cart</h1>
        </div>
      </header>

      {/* Cart Items */}
      <div className="p-4">
        {cart.map((item) => (
          <Card key={item.productId} className="mb-4" data-testid={`cart-item-${item.productId}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <img
                  src={item.imageUrl || ''}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                  loading="lazy"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground" data-testid={`item-name-${item.productId}`}>
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">per {item.unit}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-primary" data-testid={`item-price-${item.productId}`}>
                      {formatPrice(item.price)}
                    </span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 rounded-full"
                        onClick={() => updateCartItemQuantity(item.productId, item.quantity - 1)}
                        data-testid={`decrease-${item.productId}`}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="font-semibold w-8 text-center" data-testid={`quantity-${item.productId}`}>
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 rounded-full"
                        onClick={() => updateCartItemQuantity(item.productId, item.quantity + 1)}
                        data-testid={`increase-${item.productId}`}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => removeFromCart(item.productId)}
                  data-testid={`remove-${item.productId}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Bill Summary */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-3">Bill Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span data-testid="subtotal">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                {deliveryFee === 0 ? (
                  <span className="text-primary" data-testid="delivery-fee">FREE</span>
                ) : (
                  <span data-testid="delivery-fee">{formatPrice(deliveryFee)}</span>
                )}
              </div>
              {deliveryFee === 0 && subtotal < 20000 && (
                <div className="flex justify-between text-sm text-primary">
                  <span>Free Delivery Discount</span>
                  <span>-{formatPrice(3000)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span data-testid="total">{formatPrice(total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Time Selection */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-3">Delivery Time</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="p-3 h-auto border-2 border-primary bg-primary/10 text-primary"
                data-testid="delivery-asap"
              >
                <div className="text-center">
                  <div className="font-semibold">ASAP</div>
                  <div className="text-xs">30-45 mins</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="p-3 h-auto border-2"
                data-testid="delivery-scheduled"
              >
                <div className="text-center">
                  <div className="font-semibold">Schedule</div>
                  <div className="text-xs">Pick time</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Checkout Button */}
      <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 w-full max-w-[480px] bg-background p-4 border-t border-border">
        <Button
          className="w-full py-4 text-lg font-bold"
          onClick={() => setLocation('/checkout')}
          data-testid="proceed-checkout"
        >
          Proceed to Checkout - {formatPrice(total)}
        </Button>
      </div>
    </div>
  );
}
