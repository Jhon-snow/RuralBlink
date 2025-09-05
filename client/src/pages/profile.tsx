import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, User, History, MapPin, Headphones, Settings, ShoppingBag } from 'lucide-react';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';
import type { Order } from '@shared/schema';

export default function Profile() {
  const [, setLocation] = useLocation();
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ['/api/users', user?.id, 'orders'],
    enabled: !!user?.id,
  });

  const formatPrice = (price: number) => `₹${(price / 100).toFixed(0)}`;

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-muted text-muted-foreground',
      confirmed: 'bg-primary/20 text-primary',
      preparing: 'bg-primary/20 text-primary',
      out_for_delivery: 'bg-accent/20 text-accent',
      delivered: 'bg-primary/20 text-primary',
      cancelled: 'bg-destructive/20 text-destructive',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  if (!user) {
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
            <h1 className="text-xl font-bold">Profile</h1>
          </div>
        </header>

        <div className="p-4 text-center py-12" data-testid="login-required">
          <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Login Required</h2>
          <p className="text-muted-foreground mb-6">Please login to view your profile and orders</p>
          <Button onClick={() => setLocation('/')}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 pt-12">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="mr-3 bg-primary-foreground/10 hover:bg-primary-foreground/20"
            onClick={() => setLocation('/')}
            data-testid="back-button"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">Profile</h1>
        </div>
        
        <div className="text-center">
          <div className="w-20 h-20 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold" data-testid="user-name">{user.name}</h2>
          <p className="opacity-90" data-testid="user-phone">{user.phone}</p>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors ${
            activeTab === 'profile' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
          }`}
          onClick={() => setActiveTab('profile')}
          data-testid="tab-profile"
        >
          Profile
        </button>
        <button
          className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors ${
            activeTab === 'orders' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
          }`}
          onClick={() => setActiveTab('orders')}
          data-testid="tab-orders"
        >
          Orders
        </button>
      </div>

      <div className="p-4">
        {activeTab === 'profile' && (
          <>
            {/* Profile Menu */}
            <Card className="mb-4">
              <CardContent className="p-0">
                <div className="p-4 border-b border-border flex items-center justify-between cursor-pointer hover:bg-muted/50" data-testid="menu-addresses">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-primary w-5 h-5" />
                    <span className="font-medium text-foreground">Saved Addresses</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">1 Address</p>
                  </div>
                </div>
                
                <div className="p-4 border-b border-border flex items-center justify-between cursor-pointer hover:bg-muted/50" data-testid="menu-support">
                  <div className="flex items-center gap-3">
                    <Headphones className="text-primary w-5 h-5" />
                    <span className="font-medium text-foreground">Help & Support</span>
                  </div>
                </div>
                
                <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50" data-testid="menu-settings">
                  <div className="flex items-center gap-3">
                    <Settings className="text-primary w-5 h-5" />
                    <span className="font-medium text-foreground">Settings</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary" data-testid="stat-orders">{totalOrders}</div>
                  <div className="text-sm text-muted-foreground">Total Orders</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary" data-testid="stat-spent">
                    {formatPrice(totalSpent)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Spent</div>
                </CardContent>
              </Card>
            </div>

            {/* App Info */}
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold text-foreground mb-2">RuralCart</h3>
                <p className="text-sm text-muted-foreground">Version 1.0.0</p>
                <p className="text-xs text-muted-foreground mt-2">Bringing convenience to rural communities</p>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'orders' && (
          <>
            {orders.length === 0 ? (
              <div className="text-center py-12" data-testid="no-orders">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
                <Button onClick={() => setLocation('/')}>
                  Browse Products
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card 
                    key={order.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setLocation(`/order/${order.id}`)}
                    data-testid={`order-${order.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-foreground">
                            Order #{order.id.slice(-8).toUpperCase()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} items • {formatPrice(order.total)}
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status)} data-testid={`status-${order.id}`}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <p>{order.items.map(item => item.name).join(', ')}</p>
                        {order.createdAt && (
                          <p className="mt-1">
                            Ordered on {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      
                      {order.status === 'out_for_delivery' && (
                        <div className="mt-2 text-sm text-accent font-medium">
                          Track your order →
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
