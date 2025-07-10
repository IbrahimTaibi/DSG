import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface ProfileCardProps {
  joinDate?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ joinDate }) => {
  const { user } = useAuth();
  const { currentTheme } = useDarkMode();

  return (
    <div
      className="p-6 rounded-2xl w-full max-w-md mx-auto"
      style={{
        backgroundColor: currentTheme.background.secondary,
        border: `1px solid ${currentTheme.border.primary}`,
      }}>
      <div className="text-center mb-6">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4"
          style={{
            backgroundColor: currentTheme.interactive.primary,
            color: "white",
          }}>
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <h2
          className="text-xl font-semibold mb-1"
          style={{ color: currentTheme.text.primary }}>
          {user?.name}
        </h2>
        {user?.email && (
          <p className="text-sm" style={{ color: currentTheme.text.muted }}>
            {user.email}
          </p>
        )}
        {user?.address && (
          <p className="text-sm" style={{ color: currentTheme.text.muted }}>
            {user.address}
          </p>
        )}
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-medium mt-2"
          style={{
            backgroundColor: `${currentTheme.interactive.primary}20`,
            color: currentTheme.interactive.primary,
          }}>
          {user?.role === "delivery"
            ? "Livreur"
            : user?.role === "admin"
            ? "Admin"
            : "Utilisateur"}
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm" style={{ color: currentTheme.text.muted }}>
            Membre depuis
          </span>
          <span
            className="text-sm font-medium"
            style={{ color: currentTheme.text.primary }}>
            {joinDate ||
              (user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("fr-FR")
                : "-")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
