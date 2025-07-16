import React from "react";

interface AdminActionButton {
  label: React.ReactNode;
  onClick: () => void;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface AdminActionButtonsProps {
  actions: AdminActionButton[];
  loading: boolean;
}

const AdminActionButtons: React.FC<AdminActionButtonsProps> = ({ actions, loading }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {actions.map((action, index) => (
        <button
          key={index}
          className="flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            color: action.color,
            background: action.bgColor,
            borderColor: action.color + "30",
          }}
          onClick={action.onClick}
          disabled={loading}
        >
          <div
            className="p-1.5 rounded-md"
            style={{
              background: action.color + "20",
            }}
          >
            {action.icon}
          </div>
          <span className="text-sm font-medium">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default AdminActionButtons; 