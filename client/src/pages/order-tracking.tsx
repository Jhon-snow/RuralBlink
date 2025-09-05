import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Home, Truck, Phone, CheckCircle, Clock, Package } from 'lucide-react';
import { useLocation, useParams } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Order } from '@shared/schema';

export default function OrderTracking() {
  const [, setLocation] = useLocation();
  const { orderId } = useParams();

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ['/api/orders', orderId],
    enabled: !!orderId,
  });

  const formatPrice = (price: number) => `₹${(price / 100).toFixed(0)}`;

  const statusConfig = {
    pending: { icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted' },
    confirmed: { icon: CheckCircle, color: 'text-primary', bg: 'bg-primary' },
    preparing: { icon: Package, color: 'text-primary', bg: 'bg-primary' },
    out_for_delivery: { icon: Truck, color: 'text-accent', bg: 'bg-accent' },
    delivered: { icon: CheckCircle, color: 'text-primary', bg: 'bg-primary' },
    cancelled: { icon: Clock, color: 'text-destructive', bg: 'bg-destructive' },
  };

  const getStatusMessage = (status: string) => {
    const messages = {
      pending: 'Order received, waiting for confirmation',
      confirmed: 'Order confirmed and being prepared',
      preparing: 'Your order is being prepared',
      out_for_delivery: 'On the way! Will be delivered soon',
      delivered: 'Order delivered successfully',
      cancelled: 'Order has been cancelled',
    };
    return messages[status as keyof typeof messages] || 'Status unknown';
  };

  const getProgressSteps = (currentStatus: string) => {
    const steps = [
      { key: 'confirmed', label: 'Order Confirmed', time: '2:30 PM' },
      { key: 'preparing', label: 'Order Prepared', time: '2:45 PM' },
      { key: 'out_for_delivery', label: 'Out for Delivery', time: 'In progress' },
      { key: 'delivered', label: 'Delivered', time: 'Estimated: 3:15 PM' },
    ];

    const statusOrder = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex - 1,
      active: index === currentIndex - 1,
      upcoming: index > currentIndex - 1,
    }));
  };

  if (isLoading) {
    return (
      <div className="page-transition">
        <header className="bg-primary text-primary-foreground p-4 pt-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold">Order Tracking</h1>
              <div className="w-24 h-4 bg-primary-foreground/20 rounded loading-skeleton" />
            </div>
          </div>
        </header>
        <div className="p-4">
          <Card className="p-6 text-center loading-skeleton">
            <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4" />
            <div className="h-6 bg-muted rounded mb-2" />
            <div className="h-4 bg-muted rounded" />
          </Card>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page-transition">
        <header className="bg-primary text-primary-foreground p-4 pt-12">
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
            <h1 className="text-xl font-bold">Order Not Found</h1>
          </div>
        </header>
        <div className="p-4 text-center py-12">
          <p className="text-muted-foreground">Order not found or may have been removed.</p>
          <Button onClick={() => setLocation('/')} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const currentStatusConfig = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = currentStatusConfig.icon;
  const progressSteps = getProgressSteps(order.status);

  return (
    <div className="page-transition">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 pt-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">Order Tracking</h1>
            <p className="text-sm opacity-90" data-testid="order-id">
              Order #{order.id.slice(-8).toUpperCase()}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="bg-primary-foreground/10 hover:bg-primary-foreground/20"
            onClick={() => setLocation('/')}
            data-testid="home-button"
          >
            <Home className="w-6 h-6" />
          </Button>
        </div>
      </header>

      <div className="p-4">
        {/* Order Status Card */}
        <Card className="mb-6 text-center" data-testid="order-status">
          <CardContent className="p-6">
            <div className={`w-20 h-20 ${currentStatusConfig.bg}/20 rounded-full flex items-center justify-center mx-auto mb-4`}>
              <StatusIcon className={`${currentStatusConfig.color} w-8 h-8`} />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2" data-testid="status-title">
              {order.status === 'out_for_delivery' ? 'On the way!' : getStatusMessage(order.status)}
            </h2>
            <p className="text-muted-foreground mb-4">
              {order.status === 'out_for_delivery' 
                ? 'Your order will be delivered in 15-20 minutes'
                : 'We\'ll keep you updated on your order progress'
              }
            </p>
            {order.status === 'out_for_delivery' && (
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Phone className="text-primary w-4 h-4" />
                  <span>Delivery: +91 98765 43210</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Progress */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-4">Order Progress</h3>
            <div className="space-y-4">
              {progressSteps.map((step, index) => {
                const StepIcon = step.completed || step.active ? CheckCircle : 
                                step.key === 'out_for_delivery' ? Truck : Package;
                
                return (
                  <div key={step.key} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-primary text-primary-foreground' :
                      step.active ? 'bg-accent text-accent-foreground' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      <StepIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${step.upcoming ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {step.label}
                      </p>
                      <p className={`text-sm ${
                        step.active ? 'text-accent font-medium' : 'text-muted-foreground'
                      }`}>
                        {step.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={`${item.productId}-${index}`} className="flex items-center gap-3" data-testid={`order-item-${index}`}>
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} {item.unit} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <span className="font-semibold text-foreground">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            
            <Separator className="my-3" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total Paid</span>
              <span data-testid="order-total">{formatPrice(order.total)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Address */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-3">Delivery Address</h3>
            <div className="text-sm">
              <p className="font-medium">{order.deliveryAddress.label}</p>
              <p className="text-muted-foreground">{order.deliveryAddress.full}</p>
              <p className="text-muted-foreground">Phone: {order.deliveryAddress.phone}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
