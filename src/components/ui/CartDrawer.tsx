import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { CartItem } from './CartItem';
import { useRouter } from 'next/router';
import { useCurrency } from '@/hooks/useCurrency';

const CartDrawer: React.FC = () => {
  const { state } = useCart();
  const cart = state.items;
  const total = state.total;
  const { currentTheme } = useDarkMode();
  const { format } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);

  // Expose openDrawer function globally
  useEffect(() => {
    (window as unknown as { openCartDrawer?: () => void }).openCartDrawer = openDrawer;
    return () => {
      delete (window as unknown as { openCartDrawer?: () => void }).openCartDrawer;
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] transition-all duration-600 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-modal="true"
      role="dialog"
      style={{ 
        background: isOpen ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0)',
        backdropFilter: isOpen ? 'blur(4px)' : 'blur(0px)',
      }}
      onClick={closeDrawer}
    >
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-[95vw] sm:max-w-[420px] md:max-w-[480px] lg:max-w-[520px] bg-white dark:bg-gray-900 shadow-2xl z-[9999] transform transition-all duration-600 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ 
          background: currentTheme.background.card,
          transformOrigin: 'right center',
          boxShadow: isOpen ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : '0 0 0 0 rgba(0, 0, 0, 0)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className={`flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b transition-all duration-700 ease-out ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
          style={{ borderColor: currentTheme.border.primary }}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div 
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-500 ease-out ${isOpen ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`}
              style={{ backgroundColor: currentTheme.interactive.primary }}
            >
              <span className="text-xs sm:text-sm font-bold" style={{ color: currentTheme.text.inverse }}>🛒</span>
            </div>
            <h2 
              className={`text-lg sm:text-xl font-bold transition-all duration-700 ease-out ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}
              style={{ color: currentTheme.text.primary }}
            >
              Mon Panier
            </h2>
          </div>
          <button 
            onClick={closeDrawer} 
            aria-label="Fermer le panier" 
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-out hover:scale-110 active:scale-95 ${isOpen ? 'scale-100 rotate-0' : 'scale-0 rotate-90'}`}
            style={{ 
              color: currentTheme.text.secondary,
              backgroundColor: currentTheme.background.secondary,
              border: `1px solid ${currentTheme.border.primary}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = currentTheme.status.error;
              e.currentTarget.style.color = currentTheme.text.inverse;
              e.currentTarget.style.transform = 'scale(1.1) rotate(0deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = currentTheme.background.secondary;
              e.currentTarget.style.color = currentTheme.text.secondary;
              e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
            }}
          >
            &times;
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {!cart || cart.length === 0 ? (
            <div 
              className={`flex flex-col items-center justify-center h-full px-4 sm:px-6 py-12 sm:py-16 transition-all duration-700 ease-out ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            >
              <div 
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-3 sm:mb-4 transition-all duration-1000 ease-out ${isOpen ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`}
                style={{ 
                  backgroundColor: currentTheme.background.secondary,
                  border: `2px dashed ${currentTheme.border.primary}`,
                }}
              >
                <span className="text-2xl sm:text-3xl">🛒</span>
              </div>
              <h3 
                className={`text-base sm:text-lg font-semibold mb-2 text-center transition-all duration-800 ease-out ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                style={{ color: currentTheme.text.primary }}
              >
                Votre panier est vide
              </h3>
              <p 
                className={`text-xs sm:text-sm text-center max-w-[280px] sm:max-w-xs px-2 transition-all duration-900 ease-out ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                style={{ color: currentTheme.text.secondary }}
              >
                Ajoutez des produits à votre panier pour commencer vos achats
              </p>
            </div>
          ) : (
            <div 
              className={`px-4 sm:px-6 py-3 sm:py-4 transition-all duration-600 ease-out ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            >
              {cart.map((item, index) => (
                <div
                  key={item.product._id || item.product.id}
                  className={`transition-all duration-500 ease-out ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  <CartItem product={item.product} quantity={item.quantity} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && cart.length > 0 && (
          <div 
            className={`border-t px-4 sm:px-6 py-4 sm:py-5 transition-all duration-700 ease-out ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            style={{ borderColor: currentTheme.border.primary }}
          >
            {/* Summary */}
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <div 
                className={`flex items-center justify-between transition-all duration-500 ease-out ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}
                style={{ transitionDelay: '200ms' }}
              >
                <span className="text-xs sm:text-sm" style={{ color: currentTheme.text.secondary }}>Sous-total</span>
                <span className="text-xs sm:text-sm font-medium" style={{ color: currentTheme.text.primary }}>{format(total || 0)}</span>
              </div>
              <div 
                className={`flex items-center justify-between transition-all duration-500 ease-out ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}
                style={{ transitionDelay: '300ms' }}
              >
                <span className="text-xs sm:text-sm" style={{ color: currentTheme.text.secondary }}>Livraison</span>
                <span className="text-xs sm:text-sm font-medium" style={{ color: currentTheme.text.primary }}>Gratuit</span>
              </div>
              <div 
                className={`border-t pt-2 sm:pt-3 transition-all duration-500 ease-out ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}
                style={{ 
                  borderColor: currentTheme.border.primary,
                  transitionDelay: '400ms',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base sm:text-lg font-bold" style={{ color: currentTheme.text.primary }}>Total</span>
                  <span className="text-lg sm:text-xl font-bold" style={{ color: currentTheme.interactive.primary }}>{format(total || 0)}</span>
                </div>
              </div>
            </div>
            
            {/* Checkout Button */}
            <button 
              className={`w-full py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-lg ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
              style={{
                backgroundColor: currentTheme.interactive.primary,
                color: currentTheme.text.inverse,
                transitionDelay: '500ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.interactive.primaryHover;
                e.currentTarget.style.color = currentTheme.text.inverse;
                e.currentTarget.style.transform = 'scale(1.02) translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.interactive.primary;
                e.currentTarget.style.color = currentTheme.text.inverse;
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
              }}
              onClick={() => {
                closeDrawer();
                router.push('/checkout');
              }}
            >
              Commander maintenant
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};

export default CartDrawer; 