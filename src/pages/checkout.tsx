import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ArrowLeft, CreditCard, Truck, Check } from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
}

const CheckoutPage: NextPage = () => {
  const { state } = useCart();
  const { user } = useAuth();
  const { currentTheme } = useDarkMode();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.mobile || '',
    address: user?.address || '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });

  // Redirect if cart is empty or user is not authenticated
  React.useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/checkout');
      return;
    }
    if (state.items.length === 0) {
      router.push('/cart');
      return;
    }
  }, [user, state.items.length, router]);

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send the order to your backend
      // const response = await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     items: state.items,
      //     total: state.total * 1.1,
      //     shipping: formData,
      //     payment: {
      //       cardNumber: formData.cardNumber.slice(-4),
      //       cardName: formData.cardName,
      //     }
      //   })
      // });

      setOrderPlaced(true);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an error placing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinueShopping = () => {
    router.push('/categories');
  };

  if (orderPlaced) {
    return (
      <>
        <Head>
          <title>Order Confirmed - DSG</title>
          <meta name="description" content="Your order has been confirmed" />
        </Head>

        <div 
          className="min-h-screen"
          style={{ backgroundColor: currentTheme.background.primary }}
        >
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div 
                className="mx-auto flex items-center justify-center h-12 w-12 rounded-full"
                style={{ backgroundColor: `${currentTheme.status.success}20` }}
              >
                <Check 
                  className="h-6 w-6" 
                  style={{ color: currentTheme.status.success }}
                />
              </div>
              <h1 
                className="mt-4 text-2xl font-bold"
                style={{ color: currentTheme.text.primary }}
              >
                Order Confirmed!
              </h1>
              <p 
                className="mt-2"
                style={{ color: currentTheme.text.secondary }}
              >
                Thank you for your purchase. Your order has been successfully placed.
              </p>
              <div className="mt-8">
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

  if (!user || state.items.length === 0) {
    return null; // Will redirect
  }

  const subtotal = state.total;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <>
      <Head>
        <title>Checkout - DSG</title>
        <meta name="description" content="Complete your purchase" />
      </Head>

      <div 
        className="min-h-screen"
        style={{ backgroundColor: currentTheme.background.primary }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              onClick={() => router.push('/cart')}
              variant="outline"
              className="inline-flex items-center gap-2 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Cart
            </Button>
            <h1 
              className="text-2xl font-bold"
              style={{ color: currentTheme.text.primary }}
            >
              Checkout
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-8">
              {/* Shipping Information */}
              <div 
                className="rounded-lg shadow p-6"
                style={{ 
                  backgroundColor: currentTheme.background.card,
                  border: `1px solid ${currentTheme.border.primary}`,
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Truck 
                    className="w-5 h-5" 
                    style={{ color: currentTheme.interactive.primary }}
                  />
                  <h2 
                    className="text-lg font-medium"
                    style={{ color: currentTheme.text.primary }}
                  >
                    Shipping Information
                  </h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                  <Input
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                </div>
                
                <div className="mt-4">
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                
                <div className="mt-4">
                  <Input
                    label="Phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>
                
                <div className="mt-4">
                  <Input
                    label="Address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <Input
                    label="City"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                  />
                  <Input
                    label="State"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    required
                  />
                  <Input
                    label="ZIP Code"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Payment Information */}
              <div 
                className="rounded-lg shadow p-6"
                style={{ 
                  backgroundColor: currentTheme.background.card,
                  border: `1px solid ${currentTheme.border.primary}`,
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard 
                    className="w-5 h-5" 
                    style={{ color: currentTheme.interactive.primary }}
                  />
                  <h2 
                    className="text-lg font-medium"
                    style={{ color: currentTheme.text.primary }}
                  >
                    Payment Information
                  </h2>
                </div>
                
                <div className="mt-4">
                  <Input
                    label="Card Number"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Input
                    label="Expiry Date"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    placeholder="MM/YY"
                    required
                  />
                  <Input
                    label="CVV"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    placeholder="123"
                    required
                  />
                </div>
                
                <div className="mt-4">
                  <Input
                    label="Name on Card"
                    value={formData.cardName}
                    onChange={(e) => handleInputChange('cardName', e.target.value)}
                    required
                  />
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
                
                <div className="space-y-3 mb-6">
                  {state.items.map((item) => (
                    <div key={item.product._id} className="flex justify-between text-sm">
                      <span style={{ color: currentTheme.text.secondary }}>
                        {item.product.name} × {item.quantity}
                      </span>
                      <span 
                        className="font-medium"
                        style={{ color: currentTheme.text.primary }}
                      >
                        {((item.product.price ?? 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div 
                  className="border-t pt-4 space-y-3"
                  style={{ borderColor: currentTheme.border.primary }}
                >
                  <div className="flex justify-between text-sm">
                    <span style={{ color: currentTheme.text.secondary }}>Subtotal</span>
                    <span 
                      className="font-medium"
                      style={{ color: currentTheme.text.primary }}
                    >
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span style={{ color: currentTheme.text.secondary }}>Shipping</span>
                    <span 
                      className="font-medium"
                      style={{ color: currentTheme.text.primary }}
                    >Free</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span style={{ color: currentTheme.text.secondary }}>Tax</span>
                    <span 
                      className="font-medium"
                      style={{ color: currentTheme.text.primary }}
                    >
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                  
                  <div 
                    className="border-t pt-3"
                    style={{ borderColor: currentTheme.border.primary }}
                  >
                    <div className="flex justify-between text-base font-medium">
                      <span style={{ color: currentTheme.text.primary }}>Total</span>
                      <span style={{ color: currentTheme.text.primary }}>
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6">
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage; 