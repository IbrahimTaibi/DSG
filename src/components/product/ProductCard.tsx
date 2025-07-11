import React from 'react';
import { Product } from '@/types/product';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { AddToCartButton } from '@/components/ui/AddToCartButton';
import { Heart, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product & { discount?: number; oldPrice?: number; rating?: number };
  onClick?: () => void;
}

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80';

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { currentTheme } = useDarkMode();

  return (
    <article
      className="flex flex-col rounded-3xl shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl focus-within:shadow-2xl focus-within:-translate-y-1 outline-none cursor-pointer group border bg-white overflow-hidden"
      tabIndex={0}
      style={{
        backgroundColor: currentTheme.background.card,
        border: `1px solid ${currentTheme.border.primary}`,
      }}
      aria-label={product.name}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      <div className="relative w-full" style={{ height: 180, background: currentTheme.background.secondary }}>
        {/* Discount badge */}
        {product.discount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg z-10 shadow">
            -{product.discount}%
          </span>
        )}
        {/* Favorite icon */}
        <button className="absolute top-3 right-3 bg-white/80 rounded-full p-1 z-10 hover:bg-white shadow transition">
          <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
        </button>
        <img
          src={product.image || PLACEHOLDER_IMAGE}
          alt={product.name}
          className="object-cover object-center w-full h-full rounded-3xl"
          style={{ width: '100%', height: 180, display: 'block' }}
          loading="lazy"
        />
      </div>
      <div className="flex flex-col flex-1 w-full p-4 gap-2">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold truncate" style={{ color: currentTheme.text.primary }}>
            {product.name}
          </h3>
          {typeof product.price === 'number' && (
            <span className="text-lg font-bold" style={{ color: currentTheme.interactive.primary }}>
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
        {/* Old price if available */}
        {product.oldPrice && (
          <span className="text-xs line-through text-gray-400 mb-1">${product.oldPrice.toFixed(2)}</span>
        )}
        {/* Rating if available */}
        {product.rating && (
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
        )}
        <div className="flex justify-end mt-2">
          <AddToCartButton
            product={product}
            className="!w-auto !min-w-0 px-5 py-1 text-sm font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow"
            variant="primary"
            size="md"
            customLabel="Ajouter au panier"
          />
        </div>
      </div>
    </article>
  );
};

export default ProductCard; 