import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Minus, Plus, X } from 'lucide-react';
import { Product } from '../../types/product';
import { useCurrency } from '@/hooks/useCurrency';

interface CartItemProps {
  product: Product;
  quantity: number;
}

export const CartItem: React.FC<CartItemProps> = ({ product, quantity }) => {
  const { updateQuantity, removeItem } = useCart();
  const { currentTheme } = useDarkMode();
  const { format } = useCurrency();
  const [imageError, setImageError] = useState(false);

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(product._id || product.id, newQuantity);
  };

  const handleRemove = () => {
    removeItem(product._id || product.id);
  };

  return (
    <div 
      className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 mb-3 sm:mb-4 rounded-xl transition-all duration-300 ease-out hover:shadow-md hover:scale-[1.01] hover:-translate-y-0.5"
      style={{ 
        backgroundColor: currentTheme.background.secondary,
        border: `1px solid ${currentTheme.border.primary}`,
      }}
    >
      {/* Product Image */}
      <div className="flex-shrink-0">
        {imageError || !product.image ? (
          // Fallback when image fails to load or doesn't exist
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.interactive.primary}15, ${currentTheme.interactive.primary}08)`,
              border: `1px solid ${currentTheme.border.primary}`,
            }}
          >
            <div className="text-center">
              <div 
                className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1 rounded-full flex items-center justify-center"
                style={{ backgroundColor: currentTheme.interactive.primary }}
              >
                <span 
                  className="text-sm sm:text-lg"
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
            width={80}
            height={80}
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl"
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
          />
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 
              className="text-sm sm:text-base font-semibold truncate mb-1"
              style={{ color: currentTheme.text.primary }}
            >
              {product.name}
            </h3>
            <p 
              className="text-xs sm:text-sm mb-2"
              style={{ color: currentTheme.text.secondary }}
            >
              {product.category?.name}
            </p>
          </div>
          
          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="p-1.5 sm:p-2 rounded-full transition-all duration-200 hover:scale-110 ml-2"
            style={{
              color: currentTheme.status.error,
              backgroundColor: currentTheme.background.primary,
              border: `1px solid ${currentTheme.border.primary}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = currentTheme.status.error;
              e.currentTarget.style.color = currentTheme.text.inverse;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = currentTheme.background.primary;
              e.currentTarget.style.color = currentTheme.status.error;
            }}
            aria-label="Remove item"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Price and Quantity Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Unit Price */}
            <div>
              <p 
                className="text-xs sm:text-sm"
                style={{ color: currentTheme.text.secondary }}
              >
                Prix unitaire
              </p>
              <p 
                className="text-sm sm:text-base font-semibold"
                style={{ color: currentTheme.text.primary }}
              >
                {format(product.price ?? 0)}
              </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{
                  color: currentTheme.text.secondary,
                  backgroundColor: currentTheme.background.primary,
                  border: `1px solid ${currentTheme.border.primary}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.interactive.primary;
                  e.currentTarget.style.color = currentTheme.text.inverse;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.background.primary;
                  e.currentTarget.style.color = currentTheme.text.secondary;
                }}
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              
              <span 
                className="w-10 sm:w-12 text-center text-sm sm:text-base font-semibold px-2 sm:px-3 py-1 rounded-lg"
                style={{ 
                  color: currentTheme.text.primary,
                  backgroundColor: currentTheme.background.primary,
                  border: `1px solid ${currentTheme.border.primary}`,
                }}
              >
                {quantity}
              </span>
              
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{
                  color: currentTheme.text.secondary,
                  backgroundColor: currentTheme.background.primary,
                  border: `1px solid ${currentTheme.border.primary}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.interactive.primary;
                  e.currentTarget.style.color = currentTheme.text.inverse;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.background.primary;
                  e.currentTarget.style.color = currentTheme.text.secondary;
                }}
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Total Price */}
          <div className="text-right sm:text-right">
            <p 
              className="text-xs sm:text-sm"
              style={{ color: currentTheme.text.secondary }}
            >
              Total
            </p>
            <p 
              className="text-base sm:text-lg font-bold"
              style={{ color: currentTheme.interactive.primary }}
            >
              {format((product.price ?? 0) * quantity)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 