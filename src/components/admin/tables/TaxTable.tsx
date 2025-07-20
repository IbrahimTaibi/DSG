import React from 'react';
import { Tax } from '@/services/taxService';
import { useDarkMode } from '@/contexts/DarkModeContext';
import Button from '@/components/ui/Button';

interface TaxTableProps {
  taxes: Tax[];
  onEdit: (tax: Tax) => void;
  onDelete: (tax: Tax) => void;
  loading?: boolean;
}

const TaxTable: React.FC<TaxTableProps> = ({ taxes, onEdit, onDelete, loading }) => {
  const { currentTheme } = useDarkMode();

  return (
    <div className="overflow-x-auto rounded-lg border" style={{ borderColor: currentTheme.border.primary, background: currentTheme.background.card }}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead style={{ background: currentTheme.background.secondary }}>
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: currentTheme.text.secondary }}>Name</th>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: currentTheme.text.secondary }}>Rate (%)</th>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: currentTheme.text.secondary }}>Code</th>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: currentTheme.text.secondary }}>Type</th>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: currentTheme.text.secondary }}>Active</th>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: currentTheme.text.secondary }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {taxes.length === 0 && !loading && (
            <tr>
              <td colSpan={6} className="px-4 py-4 text-center text-sm" style={{ color: currentTheme.text.secondary }}>
                No taxes found.
              </td>
            </tr>
          )}
          {taxes.map((tax) => (
            <tr key={tax.id} style={{ background: currentTheme.background.primary }}>
              <td className="px-4 py-2" style={{ color: currentTheme.text.primary }}>{tax.name}</td>
              <td className="px-4 py-2" style={{ color: currentTheme.text.primary }}>{tax.rate}</td>
              <td className="px-4 py-2" style={{ color: currentTheme.text.primary }}>{tax.code}</td>
              <td className="px-4 py-2" style={{ color: currentTheme.text.primary }}>{tax.type || '-'}</td>
              <td className="px-4 py-2" style={{ color: currentTheme.text.primary }}>{tax.active ? 'Yes' : 'No'}</td>
              <td className="px-4 py-2 flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => onEdit(tax)} disabled={loading}>Edit</Button>
                <Button size="sm" variant="outline" onClick={() => onDelete(tax)} disabled={loading}>Delete</Button>
              </td>
            </tr>
          ))}
          {loading && (
            <tr>
              <td colSpan={6} className="px-4 py-4 text-center text-sm" style={{ color: currentTheme.text.secondary }}>
                Loading taxes...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaxTable; 