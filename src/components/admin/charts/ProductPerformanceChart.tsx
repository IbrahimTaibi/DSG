import React from 'react';

export interface ProductPerformanceData {
  name: string;
  sales: number;
  revenue: number;
  rating: number;
}

interface ProductPerformanceChartProps {
  data: ProductPerformanceData[];
}

const ProductPerformanceChart: React.FC<ProductPerformanceChartProps> = ({ data }) => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', border: '1px dashed #ccc', borderRadius: '8px' }}>
      <h2>Product Performance Chart</h2>
      <p>This is a placeholder for the Product Performance Chart.</p>
      <table style={{ margin: '1rem auto', borderCollapse: 'collapse', width: '100%', maxWidth: 600 }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Name</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Sales</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Revenue</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Rating</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx}>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{item.name}</td>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{item.sales}</td>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{item.revenue}</td>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{item.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductPerformanceChart; 