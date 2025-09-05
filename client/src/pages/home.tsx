import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, User, Truck, MapPin } from 'lucide-react';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import type { Category, Product } from '@shared/schema';

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useStore();

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: searchResults = [], isLoading: searchLoading } = useQuery<Product[]>({
    queryKey: ['/api/search'],
    enabled: searchQuery.length > 2,
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const recentProducts = products.slice(0, 6);

  const handleCategoryClick = (category: Category) => {
    setLocation(`/category/${category.slug}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="page-transition">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 pt-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold" data-testid="app-title">RuralCart</h1>
            <p className="text-sm opacity-90 flex items-center gap-1" data-testid="delivery-location">
              <MapPin className="w-4 h-4" />
              {user?.address?.full.split('\n')[0] || 'Delivering to Village Center'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="bg-primary-foreground/10 hover:bg-primary-foreground/20"
            onClick={() => setLocation('/profile')}
            data-testid="profile-button"
          >
            <User className="w-6 h-6" />
          </Button>
        </div>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <Input
            type="text"
            placeholder="Search for groceries, medicines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 bg-background text-foreground"
            data-testid="search-input"
          />
          <Search className="absolute left-4 top-3 w-5 h-5 text-muted-foreground" />
        </form>
      </header>

      {/* Delivery Info Banner */}
      <div className="bg-muted p-4 border-l-4 border-secondary">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Truck className="text-secondary w-6 h-6" />
            <div>
              <p className="font-semibold text-foreground">Free Delivery</p>
              <p className="text-sm text-muted-foreground">On orders above ₹200</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-secondary">30-45 mins</p>
            <p className="text-xs text-muted-foreground">Delivery time</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4 text-foreground" data-testid="categories-title">
          Shop by Category
        </h2>
        
        {categoriesLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="loading-skeleton">
                <CardContent className="p-4">
                  <div className="w-full h-20 bg-muted rounded-lg mb-3" />
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleCategoryClick(category)}
                data-testid={`category-${category.slug}`}
              >
                <CardContent className="p-4 text-center">
                  <img
                    src={category.imageUrl || ''}
                    alt={category.name}
                    className="w-full h-20 object-cover rounded-lg mb-3"
                    loading="lazy"
                  />
                  <h3 className="font-semibold text-foreground">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Reorder */}
      <div className="p-4 bg-muted/50">
        <h2 className="text-xl font-semibold mb-4 text-foreground" data-testid="reorder-title">
          Quick Reorder
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {recentProducts.map((product) => (
            <Card
              key={product.id}
              className="min-w-[140px] cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setLocation(`/category/${categories.find(c => c.id === product.categoryId)?.slug || 'groceries'}`)}
              data-testid={`quick-product-${product.id}`}
            >
              <CardContent className="p-3">
                <img
                  src={product.imageUrl || ''}
                  alt={product.name}
                  className="w-full h-16 object-cover rounded mb-2"
                  loading="lazy"
                />
                <p className="text-sm font-medium text-foreground">{product.name}</p>
                <p className="text-xs text-muted-foreground">
                  ₹{(product.price / 100).toFixed(0)}/{product.unit}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
