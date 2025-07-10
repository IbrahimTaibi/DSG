import React from "react";
import { useRouter } from "next/router";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { colors } from "@/theme";

interface ProfileActionsProps {
  onLogout?: () => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({ onLogout }) => {
  const router = useRouter();
  const { currentTheme } = useDarkMode();

  const actions = [
    {
      label: "Mes Commandes",
      description: "Voir l'historique de vos commandes",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
      onClick: () => router.push("/orders"),
      color: "text-blue-500",
      bgColor: "bg-blue-500",
    },
    {
      label: "Mes Favoris",
      description: "Produits que vous avez aimés",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
      onClick: () => router.push("/favorites"),
      color: "text-red-500",
      bgColor: "bg-red-500",
    },
    {
      label: "Notifications",
      description: "Gérer vos notifications",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-5 5v-5zM4.19 4.19A2 2 0 004 6v10a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-1.81 1.19z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 9h.01M15 9h.01"
          />
        </svg>
      ),
      onClick: () => router.push("/notifications"),
      color: "text-yellow-500",
      bgColor: "bg-yellow-500",
    },
    {
      label: "Support",
      description: "Contacter le support client",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z"
          />
        </svg>
      ),
      onClick: () => router.push("/contact"),
      color: "text-green-500",
      bgColor: "bg-green-500",
    },
  ];

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        backgroundColor: currentTheme.background.secondary,
        border: `1px solid ${currentTheme.border.primary}`,
      }}>
      <div className="mb-6">
        <h3
          className="text-xl font-semibold mb-1"
          style={{ color: currentTheme.text.primary }}>
          Actions rapides
        </h3>
        <p className="text-sm" style={{ color: currentTheme.text.muted }}>
          Accédez rapidement à vos fonctionnalités
        </p>
      </div>

      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="w-full p-4 rounded-xl transition-all duration-200 hover:scale-[1.02] text-left"
            style={{
              backgroundColor: currentTheme.background.tertiary,
              border: `1px solid ${currentTheme.border.primary}`,
            }}>
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl ${action.color}`}
                style={{
                  backgroundColor: `${currentTheme.interactive.primary}15`,
                }}>
                {action.icon}
              </div>
              <div className="flex-1">
                <div
                  className="font-semibold mb-1"
                  style={{ color: currentTheme.text.primary }}>
                  {action.label}
                </div>
                <div
                  className="text-sm"
                  style={{ color: currentTheme.text.muted }}>
                  {action.description}
                </div>
              </div>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: currentTheme.text.muted }}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Logout Button */}
      <div
        className="mt-6 pt-6 border-t"
        style={{ borderColor: currentTheme.border.primary }}>
        <button
          onClick={onLogout}
          className="w-full p-4 rounded-xl transition-all duration-200 hover:scale-[1.02] text-left"
          style={{
            backgroundColor: `${colors.error[500]}15`,
            border: `1px solid ${colors.error[500]}30`,
          }}>
          <div className="flex items-center gap-4">
            <div
              className="p-3 rounded-xl"
              style={{
                backgroundColor: `${colors.error[500]}20`,
                color: colors.error[500],
              }}>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>
            <div className="flex-1">
              <div
                className="font-semibold mb-1"
                style={{ color: colors.error[500] }}>
                Se déconnecter
              </div>
              <div
                className="text-sm"
                style={{ color: currentTheme.text.muted }}>
                Fermer votre session
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ProfileActions;
