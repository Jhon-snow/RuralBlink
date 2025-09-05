import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import Home from "@/pages/home";
import Category from "@/pages/category";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout";
import OrderTracking from "@/pages/order-tracking";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";

// Components
import BottomNav from "@/components/bottom-nav";
import FloatingCart from "@/components/floating-cart";
import OfflineIndicator from "@/components/offline-indicator";

function Router() {
  return (
    <div className="container">
      <OfflineIndicator />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/categories" component={Category} />
        <Route path="/category/:slug" component={Category} />
        <Route path="/cart" component={Cart} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/order/:orderId" component={OrderTracking} />
        <Route path="/orders" component={Profile} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
      <FloatingCart />
      <BottomNav />
      <div className="h-20" /> {/* Bottom nav spacer */}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
