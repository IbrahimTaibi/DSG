import React from 'react';

interface InvoiceProduct {
  product: string;
  name: string;
  quantity: number;
  price: number;
  tax?: {
    id: string | null;
    name: string;
    rate: number;
  };
  taxAmount?: number;
  total: number;
}

interface InvoiceCustomer {
  id: string;
  name: string;
  email?: string;
  address?: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface InvoiceData {
  _id: string;
  order: string | { _id: string; id?: string };
  products: InvoiceProduct[];
  subtotal: number;
  totalTax: number;
  total: number;
  customer: InvoiceCustomer;
  invoiceNumber: string;
  issuedAt: string;
  status: string;
}

interface ThermalInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData: InvoiceData | null;
  onPrint: () => void;
  isLoading?: boolean;
}

export default function ThermalInvoiceModal({
  isOpen,
  onClose,
  invoiceData,
  onPrint,
  isLoading = false,
}: ThermalInvoiceModalProps) {
  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getOrderId = (order: string | { _id: string; id?: string }) => {
    if (typeof order === 'string') {
      return order;
    }
    return order._id || order.id || 'N/A';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 text-white p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Facture Thermique</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 text-xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Invoice Preview */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <div className="text-gray-600">Chargement de la facture...</div>
              </div>
            </div>
          ) : invoiceData ? (
            <div className="bg-gray-50 p-4 rounded border-2 border-dashed border-gray-300">
              {/* Thermal Printer Simulation */}
              <div className="font-mono text-xs space-y-1" style={{ width: '280px' }}>
                {/* Header */}
                <div className="text-center border-b border-gray-400 pb-2 mb-2">
                  <div className="font-bold text-sm">DSG - DISTRIBUTION</div>
                  <div className="text-xs">Service de Livraison Générale</div>
                  <div className="text-xs">Tél: +212 5XX XX XX XX</div>
                  <div className="text-xs">Email: contact@dsg.ma</div>
                </div>

                {/* Invoice Info */}
                <div className="border-b border-gray-400 pb-2 mb-2">
                  <div className="flex justify-between">
                    <span>Facture N°:</span>
                    <span className="font-bold">{invoiceData.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{formatDate(invoiceData.issuedAt)}</span>
                  </div>
                                  <div className="flex justify-between">
                  <span>Commande N°:</span>
                  <span>{getOrderId(invoiceData.order)}</span>
                </div>
                </div>

                {/* Customer Info */}
                <div className="border-b border-gray-400 pb-2 mb-2">
                  <div className="font-bold mb-1">CLIENT:</div>
                  <div>{invoiceData.customer.name}</div>
                  {invoiceData.customer.email && (
                    <div className="text-xs">{invoiceData.customer.email}</div>
                  )}
                  {invoiceData.customer.address && (
                    <div className="text-xs">
                      {invoiceData.customer.address.address}
                      <br />
                      {invoiceData.customer.address.city}, {invoiceData.customer.address.state}
                      <br />
                      {invoiceData.customer.address.zipCode}
                    </div>
                  )}
                </div>

                {/* Products */}
                <div className="border-b border-gray-400 pb-2 mb-2">
                  <div className="font-bold mb-1">ARTICLES:</div>
                  {invoiceData.products.map((product, index) => (
                    <div key={index} className="mb-1">
                      <div className="flex justify-between">
                        <span className="font-bold">{product.name}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>{product.quantity} x {formatCurrency(product.price)}</span>
                        <span>{formatCurrency(product.total)}</span>
                      </div>
                      {product.tax && product.tax.rate > 0 && (
                        <div className="text-xs text-gray-600">
                          TVA {product.tax.name}: {product.tax.rate}%
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-b border-gray-400 pb-2 mb-2">
                  <div className="flex justify-between">
                    <span>Sous-total:</span>
                    <span>{formatCurrency(invoiceData.subtotal)}</span>
                  </div>
                  {invoiceData.totalTax > 0 && (
                    <div className="flex justify-between">
                      <span>TVA:</span>
                      <span>{formatCurrency(invoiceData.totalTax)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t border-gray-400 pt-1 mt-1">
                    <span>TOTAL:</span>
                    <span>{formatCurrency(invoiceData.total)}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center text-xs">
                  <div className="mb-1">Merci pour votre confiance!</div>
                  <div>DSG - Votre partenaire de livraison</div>
                  <div className="mt-2">
                    {formatDate(invoiceData.issuedAt)}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Aucune donnée de facture disponible
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-gray-50 p-4 border-t">
          <div className="flex gap-2">
            <button
              onClick={onPrint}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Imprimer
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 