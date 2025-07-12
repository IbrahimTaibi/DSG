import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ArrowLeft, CreditCard, Truck, Check, AlertTriangle } from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import Modal from '@/components/ui/Modal';
import { useCurrency } from '@/hooks/useCurrency';

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
  const { state, clearCart } = useCart();
  const { user } = useAuth();
  const { currentTheme } = useDarkMode();
  const { format } = useCurrency();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.mobile || '',
    address: typeof user?.address === 'object' && user?.address !== null
      ? user.address.address || ''
      : (user?.address || ''),
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });
  const [errorModal, setErrorModal] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

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

  const validateFields = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!formData.zipCode.trim()) errors.zipCode = 'ZIP Code is required';
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateFields();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setIsProcessing(false);
      return;
    }
    console.log('Submitting order...');
    setIsProcessing(true);

    try {
      // Send the order to the backend
      const payload = {
        products: state.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        address: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
      };
      console.log('Order payload:', payload);
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const fetchUrl = `${apiBase}/api/orders`;
      console.log('Sending order to:', fetchUrl);
      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      console.log('API response:', response);

      if (!response.ok) {
        if (response.status === 401) {
          setErrorModal({ open: true, message: 'Vous devez être connecté pour passer une commande.' });
          return;
        } else if (response.status === 403) {
          setErrorModal({ open: true, message: 'Seuls les utilisateurs peuvent passer des commandes.' });
          return;
        } else {
          setErrorModal({ open: true, message: 'Une erreur est survenue lors de la passation de votre commande. Veuillez réessayer.' });
          return;
        }
      }

      clearCart();
      setOrderPlaced(true);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an error placing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinueShopping = () => {
    router.push('/category/all');
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
                    error={fieldErrors.address}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <Input
                    label="City"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                    error={fieldErrors.city}
                  />
                  <Input
                    label="State"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    required
                    error={fieldErrors.state}
                  />
                  <Input
                    label="ZIP Code"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    required
                    error={fieldErrors.zipCode}
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
                        {format((item.product.price ?? 0) * item.quantity)}
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
                      {format(subtotal)}
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
                      {format(tax)}
                    </span>
                  </div>
                  
                  <div 
                    className="border-t pt-3"
                    style={{ borderColor: currentTheme.border.primary }}
                  >
                    <div className="flex justify-between text-base font-medium">
                      <span style={{ color: currentTheme.text.primary }}>Total</span>
                      <span style={{ color: currentTheme.text.primary }}>
                        {format(total)}
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
                    {isProcessing ? 'Processing...' : `Place Order - ${format(total)}`}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Error Modal */}
      <Modal isOpen={errorModal.open} onClose={() => setErrorModal({ open: false, message: '' })} title="Erreur">
        <div className="flex flex-col items-center justify-center">
          <div
            className="flex items-center justify-center mb-4 rounded-full"
            style={{
              backgroundColor: `${currentTheme.status.error}15`,
              width: 64,
              height: 64,
            }}
          >
            <AlertTriangle size={36} style={{ color: currentTheme.status.error }} />
          </div>
          <p className="mb-6 text-base font-medium text-center" style={{ color: currentTheme.text.primary }}>
            {errorModal.message}
          </p>
          <Button
            onClick={() => setErrorModal({ open: false, message: '' })}
            size="md"
            style={{
              backgroundColor: currentTheme.status.error,
              color: currentTheme.text.inverse,
              border: 'none',
            }}
          >
            Fermer
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default CheckoutPage; 