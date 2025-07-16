import React from "react";
import Modal from "@/components/ui/Modal";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface StatusOption {
  label: string;
  value: string;
}

interface OrderStatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: string;
  selectedStatus: string;
  options: StatusOption[];
  onChange: (status: string) => void;
  onConfirm: () => void;
  loading: boolean;
  title: string;
}

const OrderStatusChangeModal: React.FC<OrderStatusChangeModalProps> = ({
  isOpen,
  onClose,
  selectedStatus,
  options,
  onChange,
  onConfirm,
  loading,
  title,
}) => {
  const { currentTheme } = useDarkMode();
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md" loading={loading}>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: 600, color: currentTheme.text.primary }}>Statut de la commande</label>
        <select
          value={selectedStatus}
          onChange={e => onChange(e.target.value)}
          className="w-full mt-1 p-2 rounded border"
          style={{
            marginTop: 8,
            background: currentTheme.background.card,
            color: currentTheme.text.primary,
            borderColor: currentTheme.border.primary,
          }}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
        <button
          onClick={onClose}
          style={{
            padding: '8px 18px',
            borderRadius: 8,
            border: `1px solid ${currentTheme.border.primary}`,
            background: currentTheme.background.card,
            color: currentTheme.text.primary,
            fontWeight: 500,
            marginRight: 8,
            cursor: 'pointer',
          }}
        >
          Annuler
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          style={{
            padding: '8px 18px',
            borderRadius: 8,
            border: 'none',
            background: currentTheme.status.info,
            color: '#fff',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Changement...' : 'Confirmer'}
        </button>
      </div>
    </Modal>
  );
};

export default OrderStatusChangeModal; 