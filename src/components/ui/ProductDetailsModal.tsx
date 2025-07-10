import React from 'react';

interface ProductDetailsModalProps {
  open: boolean;
  onClose: () => void;
  product?: Record<string, unknown>;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ open, onClose, product }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-xl p-8 min-w-[320px] max-w-[90vw] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold mb-4">Product Details</h2>
        <div className="text-gray-700">
          <pre className="text-xs bg-gray-100 rounded p-2 overflow-x-auto">
            {product ? JSON.stringify(product, null, 2) : 'No product data.'}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal; 