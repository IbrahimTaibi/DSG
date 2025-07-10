import React from 'react';
import { Product } from '@/types/product';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { AddToCartButton } from '@/components/ui/AddToCartButton';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80';

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { currentTheme } = useDarkMode();

  return (
    <article
      className="flex flex-col rounded-2xl shadow-md transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl focus-within:shadow-xl focus-within:-translate-y-1 outline-none cursor-pointer group border"
      tabIndex={0}
      style={{
        backgroundColor: currentTheme.background.card,
        border: `1px solid ${currentTheme.border.primary}`,
      }}
      aria-label={product.name}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      <div
        className="w-full overflow-hidden rounded-t-2xl"
        style={{ background: currentTheme.background.secondary, width: '100%', height: 180 }}
      >
        <img
          src={product.image || PLACEHOLDER_IMAGE}
          alt={product.name}
          className="object-cover object-center w-full h-full transition-transform duration-200 group-hover:scale-105"
          style={{ width: '100%', height: 180, display: 'block' }}
          loading="lazy"
        />
      </div>
      <div className="flex flex-col flex-1 w-full p-4 gap-2">
        <h3
          className="text-lg font-semibold truncate mb-1"
          style={{ color: currentTheme.text.primary }}
        >
          {product.name}
        </h3>
        {product.category?.name && (
          <span
            className="text-xs font-medium uppercase tracking-wide mb-2"
            style={{ color: currentTheme.text.muted }}
          >
            {product.category.name}
          </span>
        )}
        {typeof product.price === 'number' && (
          <span
            className="text-base font-bold mb-3"
            style={{ color: currentTheme.interactive.primary }}
          >
            ${product.price.toFixed(2)}
          </span>
        )}
        <AddToCartButton
          product={product}
          className="w-full mt-auto"
          variant="primary"
          size="md"
        />
      </div>
    </article>
  );
};

export default ProductCard; 