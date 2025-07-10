import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Product } from '@/types/product';
import { ShoppingCart, Check } from 'lucide-react';

interface AddToCartButtonProps {
  product: Product;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: (e: React.MouseEvent) => void;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  className = '',
  variant = 'primary',
  size = 'md',
  onClick,
}) => {
  const { addItem, getItemQuantity } = useCart();
  const { currentTheme } = useDarkMode();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentQuantity = getItemQuantity(product._id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(e);
      return;
    }
    
    setIsAdding(true);
    
    // Simulate a brief delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    addItem(product, 1);
    setIsAdding(false);
    setShowSuccess(true);
    
    // Hide success state after 2 seconds
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'text-white';
      case 'secondary':
        return 'text-white';
      case 'outline':
        return 'border text-current hover:bg-opacity-10';
      default:
        return 'text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`
        inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${className}
      `}
      style={{
        backgroundColor: variant === 'outline' ? 'transparent' : currentTheme.interactive.primary,
        borderColor: variant === 'outline' ? currentTheme.interactive.primary : 'transparent',
        color: variant === 'outline' ? currentTheme.interactive.primary : currentTheme.text.inverse,
      }}
    >
      {showSuccess ? (
        <>
          <Check className="w-4 h-4" />
          Added!
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" />
          {isAdding ? 'Adding...' : currentQuantity > 0 ? `Add More (${currentQuantity})` : 'Add to Cart'}
        </>
      )}
    </button>
  );
}; 