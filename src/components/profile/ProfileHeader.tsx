import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface User {
  name?: string;
  email?: string;
  role?: string;
  address?: string;
  createdAt?: string;
}

interface ProfileHeaderProps {
  joinDate?: string;
  user?: User;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ joinDate, user: userProp }) => {
  const { user: contextUser } = useAuth();
  const user = userProp || contextUser;
  const { currentTheme } = useDarkMode();

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case "store":
        return "Magasin";
      case "admin":
        return "Admin";
      case "delivery":
        return "Livreur";
      default:
        return "Utilisateur";
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case "store":
        return "bg-purple-500";
      case "admin":
        return "bg-red-500";
      case "delivery":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-8"
      style={{
        background: `linear-gradient(135deg, ${currentTheme.background.secondary}, ${currentTheme.background.tertiary})`,
        border: `1px solid ${currentTheme.border.primary}`,
      }}>
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, ${currentTheme.interactive.primary} 2px, transparent 2px)`,
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center">
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold mb-4 shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.interactive.primary}, ${currentTheme.interactive.primaryHover})`,
              color: "white",
            }}>
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white ${getRoleColor(
              user?.role,
            )}`}>
            <span className="w-2 h-2 bg-white rounded-full mr-2 opacity-80"></span>
            {getRoleLabel(user?.role)}
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1 text-center md:text-left">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: currentTheme.text.primary }}>
            {user?.name}
          </h1>
          <p
            className="text-lg mb-4"
            style={{ color: currentTheme.text.muted }}>
            {user?.email}
          </p>
          {user?.address && (
            <p
              className="text-sm mb-4 flex items-center justify-center md:justify-start"
              style={{ color: currentTheme.text.muted }}>
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {typeof user.address === 'string'
                ? user.address
                : [user.address.address, user.address.city, user.address.state, user.address.zipCode].filter(Boolean).join(', ')}
            </p>
          )}
          <div
            className="inline-flex items-center px-3 py-1 rounded-full text-xs"
            style={{
              backgroundColor: `${currentTheme.interactive.primary}15`,
              color: currentTheme.interactive.primary,
            }}>
            <svg
              className="w-3 h-3 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Membre depuis{" "}
            {joinDate ||
              (user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("fr-FR")
                : "récemment")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
