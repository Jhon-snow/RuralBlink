import { useState } from 'react';
import { ArrowLeft, MapPin, CreditCard, Banknote } from 'lucide-react';
import { useLocation } from 'wouter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { InsertOrder } from '@shared/schema';

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const { cart, user, cartTotal, clearCart, setCurrentOrder } = useStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const subtotal = cartTotal();
  const deliveryFee = subtotal >= 20000 ? 0 : 3000;
  const total = subtotal + deliveryFee;

  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: InsertOrder) => {
      const response = await apiRequest('POST', '/api/orders', orderData);
      return response.json();
    },
    onSuccess: (order) => {
      setCurrentOrder(order);
      clearCart();
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: "Order placed successfully!",
        description: `Order #${order.id} has been confirmed. You'll receive SMS updates.`,
      });
      setLocation(`/order/${order.id}`);
    },
    onError: (error) => {
      toast({
        title: "Order failed",
        description: "Failed to place your order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const formatPrice = (price: number) => `₹${(price / 100).toFixed(0)}`;

  const handlePlaceOrder = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to place your order.",
        variant: "destructive",
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart first.",
        variant: "destructive",
      });
      return;
    }

    const orderData: InsertOrder = {
      userId: user.id,
      items: cart.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        unit: item.unit,
      })),
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      deliveryAddress: user.address || {
        label: 'Home',
        full: 'Please update your address',
        phone: user.phone,
      },
      specialInstructions: specialInstructions || undefined,
      deliveryTime: 'asap',
      status: 'pending',
    };

    placeOrderMutation.mutate(orderData);
  };

  if (cart.length === 0) {
    setLocation('/cart');
    return null;
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
            onClick={() => setLocation('/cart')}
            data-testid="back-button"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">Checkout</h1>
        </div>
      </header>

      <div className="p-4">
        {/* Delivery Address */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground">Delivery Address</h3>
              <Button variant="ghost" size="sm" className="text-secondary" data-testid="change-address">
                Change
              </Button>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="text-primary mt-1 w-5 h-5" />
              <div>
                <p className="font-medium text-foreground" data-testid="address-label">
                  {user?.address?.label || 'Home'}
                </p>
                <p className="text-sm text-muted-foreground" data-testid="address-full">
                  {user?.address?.full || 'Please update your address in profile'}
                </p>
                <p className="text-sm text-muted-foreground" data-testid="address-phone">
                  Phone: {user?.phone || 'Not provided'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Options */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-4">Payment Method</h3>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-3 p-3 border-2 border-primary bg-primary/10 rounded-lg">
                <RadioGroupItem value="cod" id="cod" />
                <Label htmlFor="cod" className="flex items-center gap-3 flex-1 cursor-pointer">
                  <Banknote className="text-primary w-6 h-6" />
                  <div>
                    <div className="font-medium text-foreground">Cash on Delivery</div>
                    <div className="text-sm text-muted-foreground">Pay when order arrives</div>
                  </div>
                </Label>
                <span className="text-primary font-bold text-sm">Recommended</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border-2 border-border rounded-lg">
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi" className="flex items-center gap-3 flex-1 cursor-pointer">
                  <CreditCard className="text-secondary w-6 h-6" />
                  <div>
                    <div className="font-medium text-foreground">UPI Payment</div>
                    <div className="text-sm text-muted-foreground">Google Pay, PhonePe, Paytm</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Special Instructions */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-3">Special Instructions</h3>
            <Textarea
              placeholder="Any special requests for delivery?"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="resize-none"
              rows={3}
              data-testid="special-instructions"
            />
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between">
                  <span>{item.quantity} × {item.name}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span data-testid="summary-subtotal">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-primary">
                <span>Delivery Fee</span>
                <span data-testid="summary-delivery">
                  {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span data-testid="summary-total">{formatPrice(total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Place Order Button */}
      <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 w-full max-w-[480px] bg-background p-4 border-t border-border">
        <Button
          className="w-full py-4 text-lg font-bold"
          onClick={handlePlaceOrder}
          disabled={placeOrderMutation.isPending}
          data-testid="place-order"
        >
          {placeOrderMutation.isPending ? 'Placing Order...' : `Place Order - ${formatPrice(total)}`}
        </Button>
      </div>
    </div>
  );
}
