import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Minus, Plus, X } from 'lucide-react';
import { Product } from '../../types/product';

interface CartItemProps {
  product: Product;
  quantity: number;
}

export const CartItem: React.FC<CartItemProps> = ({ product, quantity }) => {
  const { updateQuantity, removeItem } = useCart();
  const { currentTheme } = useDarkMode();
  const [imageError, setImageError] = useState(false);

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(product.id, newQuantity);
  };

  const handleRemove = () => {
    removeItem(product._id || product.id);
  };

  return (
    <div 
      className="flex items-center gap-4 p-4 border-b"
      style={{ borderColor: currentTheme.border.primary }}
    >
      {/* Product Image */}
      <div className="flex-shrink-0">
        {imageError || !product.image ? (
          // Fallback when image fails to load or doesn't exist
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.interactive.primary}15, ${currentTheme.interactive.primary}08)`,
              border: `1px solid ${currentTheme.border.primary}`,
            }}
          >
            <div className="text-center">
              <div 
                className="w-8 h-8 mx-auto mb-1 rounded-full flex items-center justify-center"
                style={{ backgroundColor: currentTheme.interactive.primary }}
              >
                <span 
                  className="text-sm"
                  style={{ color: currentTheme.text.inverse }}
                >
                  📦
                </span>
              </div>
            </div>
          </div>
        ) : (
          <Image
            src={product.image}
            alt={product.name}
            width={64}
            height={64}
            className="w-16 h-16 object-cover rounded-lg"
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
          />
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 
          className="text-sm font-medium truncate"
          style={{ color: currentTheme.text.primary }}
        >
          {product.name}
        </h3>
        <p 
          className="text-sm"
          style={{ color: currentTheme.text.secondary }}
        >
          {product.category?.name}
        </p>
        <p 
          className="text-sm font-medium"
          style={{ color: currentTheme.text.primary }}
        >
          ${(product.price ?? 0).toFixed(2)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleQuantityChange(quantity - 1)}
          className="p-1 rounded-full transition-colors"
          style={{
            color: currentTheme.text.secondary,
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = currentTheme.background.secondary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </button>
        
        <span 
          className="w-8 text-center text-sm font-medium"
          style={{ color: currentTheme.text.primary }}
        >
          {quantity}
        </span>
        
        <button
          onClick={() => handleQuantityChange(quantity + 1)}
          className="p-1 rounded-full transition-colors"
          style={{
            color: currentTheme.text.secondary,
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = currentTheme.background.secondary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Total Price */}
      <div className="text-right">
        <p 
          className="text-sm font-medium"
          style={{ color: currentTheme.text.primary }}
        >
          {((product.price ?? 0) * quantity).toFixed(2)}
        </p>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        className="p-1 rounded-full transition-colors"
        style={{
          color: currentTheme.status.error,
          backgroundColor: 'transparent',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = `${currentTheme.status.error}15`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        aria-label="Remove item"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}; 