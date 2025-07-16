import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useAuth } from "@/contexts/AuthContext";

const DeliveryProfile: React.FC = () => {
  const { currentTheme } = useDarkMode();
  const { user, logout } = useAuth();

  // Placeholder stats
  const stats = {
    totalDeliveries: 120,
    completedDeliveries: 115,
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center px-2 pt-4 pb-24"
      style={{ background: currentTheme.background.primary }}
    >
      <h1 className="text-2xl font-bold mb-4 w-full text-center" style={{ color: currentTheme.text.primary }}>
        Mon Profil Livreur
      </h1>
      {/* Personal Info */}
      <div
        className="w-full max-w-md rounded-2xl shadow p-4 mb-4"
        style={{ background: currentTheme.background.card }}
      >
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-2"
            style={{ background: currentTheme.background.secondary, color: currentTheme.text.primary }}
          >
            {user?.name?.[0] || "L"}
          </div>
          <div className="font-semibold text-lg" style={{ color: currentTheme.text.primary }}>{user?.name}</div>
          <div className="text-sm" style={{ color: currentTheme.text.muted }}>{user?.email}</div>
          <div className="text-sm" style={{ color: currentTheme.text.muted }}>{user?.mobile}</div>
        </div>
      </div>
      {/* Delivery Stats */}
      <div
        className="w-full max-w-md rounded-2xl shadow p-4 mb-4 flex justify-around"
        style={{ background: currentTheme.background.card }}
      >
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold" style={{ color: currentTheme.text.primary }}>{stats.totalDeliveries}</span>
          <span className="text-xs" style={{ color: currentTheme.text.muted }}>Total Livraisons</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold" style={{ color: currentTheme.text.primary }}>{stats.completedDeliveries}</span>
          <span className="text-xs" style={{ color: currentTheme.text.muted }}>Livraisons terminées</span>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="w-full max-w-md flex flex-col gap-2">
        <button
          className="w-full py-3 rounded-lg font-semibold text-base mb-2"
          style={{ background: currentTheme.interactive.primary, color: currentTheme.text.inverse }}
          onClick={() => {/* TODO: Change password logic */}}
        >
          Changer le mot de passe
        </button>
        <button
          className="w-full py-3 rounded-lg font-semibold text-base"
          style={{ background: currentTheme.status.error, color: '#fff' }}
          onClick={logout}
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
};

export default DeliveryProfile; 