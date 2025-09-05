import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { useLocation, useParams } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import type { Category, Product } from '@shared/schema';

export default function CategoryPage() {
  const [, setLocation] = useLocation();
  const { slug } = useParams();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { addToCart } = useStore();
  const { toast } = useToast();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const currentCategory = categories.find(c => c.slug === slug) || categories[0];

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/categories', currentCategory?.id, 'products'],
    enabled: !!currentCategory?.id,
  });

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (!currentCategory && categories.length > 0) {
    setLocation('/');
    return null;
  }

  return (
    <div className="page-transition">
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
          <div>
            <h1 className="text-xl font-bold" data-testid="category-title">
              {currentCategory?.name || 'Products'}
            </h1>
            <p className="text-sm opacity-90" data-testid="product-count">
              {products.length}+ items available
            </p>
          </div>
        </div>
        
        {/* Filter Bar */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedFilter === 'all' ? 'secondary' : 'ghost'}
            size="sm"
            className="whitespace-nowrap"
            onClick={() => setSelectedFilter('all')}
            data-testid="filter-all"
          >
            All
          </Button>
          {/* Add more filters based on subcategories if needed */}
        </div>
      </header>

      {/* Product Grid */}
      <div className="p-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="loading-skeleton">
                <div className="w-full h-32 bg-muted" />
                <CardContent className="p-3">
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-3 bg-muted rounded mb-2" />
                  <div className="h-6 bg-muted rounded mb-3" />
                  <div className="h-10 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden" data-testid={`product-${product.id}`}>
                <img
                  src={product.imageUrl || ''}
                  alt={product.name}
                  className="w-full h-32 object-cover"
                  loading="lazy"
                />
                <CardContent className="p-3">
                  <h3 className="font-semibold text-foreground mb-1" data-testid={`product-name-${product.id}`}>
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-primary" data-testid={`product-price-${product.id}`}>
                      ₹{(product.price / 100).toFixed(0)}/{product.unit}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-xs text-muted-foreground line-through">
                        ₹{(product.originalPrice / 100).toFixed(0)}
                      </span>
                    )}
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                    data-testid={`add-to-cart-${product.id}`}
                  >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && products.length === 0 && (
          <div className="text-center py-12" data-testid="no-products">
            <p className="text-muted-foreground">No products available in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
