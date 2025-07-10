import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useCart } from '@/contexts/CartContext';
import { CartItem } from '@/components/ui/CartItem';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/router';
import { ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useDarkMode } from '@/contexts/DarkModeContext';

const CartPage: NextPage = () => {
  const { state, clearCart } = useCart();
  const { user } = useAuth();
  const { currentTheme } = useDarkMode();
  const router = useRouter();

  const handleContinueShopping = () => {
    router.push('/categories');
  };

  const handleCheckout = () => {
    if (!user) {
      router.push('/auth/login?redirect=/cart');
      return;
    }
    router.push('/checkout');
  };

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  if (state.items.length === 0) {
    return (
      <>
        <Head>
          <title>Cart - DSG</title>
          <meta name="description" content="Your shopping cart" />
        </Head>

        <div 
          className="min-h-screen"
          style={{ backgroundColor: currentTheme.background.primary }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <ShoppingCart 
                className="mx-auto h-12 w-12" 
                style={{ color: currentTheme.text.muted }}
              />
              <h2 
                className="mt-2 text-lg font-medium"
                style={{ color: currentTheme.text.primary }}
              >
                Your cart is empty
              </h2>
              <p 
                className="mt-1 text-sm"
                style={{ color: currentTheme.text.secondary }}
              >
                Start shopping to add items to your cart
              </p>
              <div className="mt-6">
                <Button
                  onClick={handleContinueShopping}
                  className="inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Cart ({state.itemCount} items) - DSG</title>
        <meta name="description" content="Your shopping cart" />
      </Head>

      <div 
        className="min-h-screen"
        style={{ backgroundColor: currentTheme.background.primary }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 
                className="text-2xl font-bold"
                style={{ color: currentTheme.text.primary }}
              >
                Shopping Cart
              </h1>
              <p 
                style={{ color: currentTheme.text.secondary }}
              >
                {state.itemCount} {state.itemCount === 1 ? 'item' : 'items'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={handleClearCart}
                variant="outline"
                className="inline-flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear Cart
              </Button>
              <Button
                onClick={handleContinueShopping}
                variant="outline"
                className="inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div 
                className="rounded-lg shadow"
                style={{ 
                  backgroundColor: currentTheme.background.card,
                  border: `1px solid ${currentTheme.border.primary}`,
                }}
              >
                <div 
                  className="p-6 border-b"
                  style={{ borderColor: currentTheme.border.primary }}
                >
                  <h2 
                    className="text-lg font-medium"
                    style={{ color: currentTheme.text.primary }}
                  >
                    Cart Items
                  </h2>
                </div>
                <div 
                  className="divide-y"
                  style={{ borderColor: currentTheme.border.primary }}
                >
                  {state.items.map((item) => (
                    <CartItem
                      key={item.product._id}
                      product={item.product}
                      quantity={item.quantity}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div 
                className="rounded-lg shadow p-6 sticky top-8"
                style={{ 
                  backgroundColor: currentTheme.background.card,
                  border: `1px solid ${currentTheme.border.primary}`,
                }}
              >
                <h2 
                  className="text-lg font-medium mb-4"
                  style={{ color: currentTheme.text.primary }}
                >
                  Order Summary
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: currentTheme.text.secondary }}>
                      Subtotal ({state.itemCount} {state.itemCount === 1 ? 'item' : 'items'})
                    </span>
                    <span 
                      className="font-medium"
                      style={{ color: currentTheme.text.primary }}
                    >
                      ${state.total.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span style={{ color: currentTheme.text.secondary }}>Shipping</span>
                    <span 
                      className="font-medium"
                      style={{ color: currentTheme.text.primary }}
                    >
                      Free
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span style={{ color: currentTheme.text.secondary }}>Tax</span>
                    <span 
                      className="font-medium"
                      style={{ color: currentTheme.text.primary }}
                    >
                      ${(state.total * 0.1).toFixed(2)}
                    </span>
                  </div>
                  
                  <div 
                    className="border-t pt-3"
                    style={{ borderColor: currentTheme.border.primary }}
                  >
                    <div className="flex justify-between text-base font-medium">
                      <span style={{ color: currentTheme.text.primary }}>Total</span>
                      <span style={{ color: currentTheme.text.primary }}>
                        ${(state.total * 1.1).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button
                    onClick={handleCheckout}
                    className="w-full"
                    size="lg"
                  >
                    {user ? 'Proceed to Checkout' : 'Sign in to Checkout'}
                  </Button>
                  
                  {!user && (
                    <p 
                      className="text-xs text-center"
                      style={{ color: currentTheme.text.muted }}
                    >
                      You&apos;ll need to sign in to complete your purchase
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage; 