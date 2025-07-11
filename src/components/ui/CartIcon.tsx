import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useRouter } from 'next/router';
import { ShoppingCart } from 'lucide-react';

interface CartIconProps {
  className?: string;
  showCount?: boolean;
  onClick?: () => void;
}

export const CartIcon: React.FC<CartIconProps> = ({ 
  className = '', 
  showCount = true,
  onClick
}) => {
  const { state } = useCart();
  const { currentTheme } = useDarkMode();
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push('/cart');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`relative p-2 rounded-full transition-colors ${className}`}
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
      aria-label="Shopping cart"
    >
      <ShoppingCart className="w-6 h-6" style={{ color: currentTheme.text.secondary }} />
      
      {showCount && state.itemCount > 0 && (
        <span 
          className="absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
          style={{
            backgroundColor: currentTheme.status.error,
          }}
        >
          {state.itemCount > 99 ? '99+' : state.itemCount}
        </span>
      )}
    </button>
  );
}; 