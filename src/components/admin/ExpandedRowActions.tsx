import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { AdminResource } from "@/types/admin";
import ProductDetailsModal from "../ui/ProductDetailsModal";
import { useRouter } from "next/router";

interface ExpandedRowActionsProps<T> {
  row: T;
  resource: AdminResource<T>;
  onPrintInvoice?: (item: T) => void;
  onToggleStatus?: (item: T) => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  loading: boolean;
}

// Helper type for objects that might have _id or id
interface WithId {
  _id?: string;
  id?: string;
}

export default function ExpandedRowActions<T extends { id: string }>({
  row,
  resource,
  onPrintInvoice,
  onToggleStatus,
  onEdit,
  onDelete,
  loading,
}: ExpandedRowActionsProps<T>) {
  const { currentTheme } = useDarkMode();
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const router = useRouter();

  // Define actions based on resource type
  const getActions = () => {
    // Only show Edit, Delete, and Show Details for categories
    if (resource.name === "categories") {
      return [
        {
          label: "Voir les détails de la catégorie",
          onClick: () => router.push(`/admin/categories/${row.id}`),
          icon: (
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path
                d="M8 2a6 6 0 100 12A6 6 0 008 2zM4 8a4 4 0 118 0 4 4 0 01-8 0z"
                fill="currentColor"
              />
            </svg>
          ),
          color: currentTheme.status.info,
          bgColor: currentTheme.status.info + "15",
        },
      ];
    }
    const baseActions = [
      ...(onPrintInvoice
        ? [
            {
              label: "Imprimer la facture",
              onClick: () => onPrintInvoice(row),
              icon: (
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <path
                    d="M4 2h8v2H4V2zm0 4h8v8H4V6zm2 2v4h4V8H6z"
                    fill="currentColor"
                  />
                </svg>
              ),
              color: currentTheme.status.success,
              bgColor: currentTheme.status.success + "15",
            },
          ]
        : []),
    ];

    // Add resource-specific actions
    switch (resource.name) {
      case "orders":
        baseActions.push({
          label: "Voir l'adresse",
          onClick: () =>
            window.open("https://maps.google.com/?q=Paris,France", "_blank"),
          icon: (
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path
                d="M8 0C4.69 0 2 2.69 2 6c0 4 6 10 6 10s6-6 6-10c0-3.31-2.69-6-6-6zm0 9c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
                fill="currentColor"
              />
            </svg>
          ),
          color: currentTheme.status.info,
          bgColor: currentTheme.status.info + "15",
        });
        break;
      case "products":
        baseActions.push({
          label: "Voir les détails",
          onClick: () => setDetailsOpen(true),
          icon: (
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path
                d="M14 2H2a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1V3a1 1 0 00-1-1zM2 1a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V3a2 2 0 00-2-2H2z"
                fill="currentColor"
              />
              <path
                d="M4 5h8v1H4V5zm0 2h8v1H4V7zm0 2h6v1H4V9z"
                fill="currentColor"
              />
            </svg>
          ),
          color: currentTheme.status.info,
          bgColor: currentTheme.status.info + "15",
        });
        break;
      case "users":
        baseActions.push({
          label: "Voir le profil",
          onClick: () => {
            router.push(`/admin/users/${row.id}`);
          },
          icon: (
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path
                d="M8 8a3 3 0 100-6 3 3 0 000 6zM8 10c-2.33 0-7 1.17-7 3.5V16h14v-2.5c0-2.33-4.67-3.5-7-3.5z"
                fill="currentColor"
              />
            </svg>
          ),
          color: currentTheme.status.info,
          bgColor: currentTheme.status.info + "15",
        });
        break;
      case "reviews":
        baseActions.push({
          label: "Voir l'avis complet",
          onClick: () => {
            // Open review details modal
            console.log("View full review:", row);
          },
          icon: (
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path
                d="M12 2H4a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2zM8 6a2 2 0 100 4 2 2 0 000-4z"
                fill="currentColor"
              />
              <path
                d="M12 12l-2-2-2 2-2-2-2 2"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
            </svg>
          ),
          color: currentTheme.status.info,
          bgColor: currentTheme.status.info + "15",
        });
        break;
    }

    return baseActions;
  };

  const actions = [
    ...getActions(),
    // Only show Edit and Delete for categories
    ...(resource.name === "categories"
      ? [
          {
            label: "Modifier",
            onClick: () => onEdit(row),
            icon: (
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                <path
                  d="M12.854 2.146a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3-3a.5.5 0 010-.708l3-3a.5.5 0 01.708 0l7 7z"
                  fill="currentColor"
                />
              </svg>
            ),
            color: currentTheme.status.info,
            bgColor: currentTheme.status.info + "15",
          },
          {
            label: "Supprimer",
            onClick: () => onDelete(row),
            icon: (
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                <path
                  d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z"
                  fill="currentColor"
                />
              </svg>
            ),
            color: currentTheme.status.error,
            bgColor: currentTheme.status.error + "15",
          },
        ]
      : [
          ...(onToggleStatus
            ? [
                {
                  label: "Changer le statut",
                  onClick: () => onToggleStatus(row),
                  icon: (
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                      <path
                        d="M8 2a6 6 0 100 12A6 6 0 008 2zM4 8a4 4 0 118 0 4 4 0 01-8 0z"
                        fill="currentColor"
                      />
                    </svg>
                  ),
                  color: currentTheme.status.info,
                  bgColor: currentTheme.status.info + "15",
                },
              ]
            : []),
          {
            label: "Modifier",
            onClick: () => onEdit(row),
            icon: (
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                <path
                  d="M12.854 2.146a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3-3a.5.5 0 010-.708l3-3a.5.5 0 01.708 0l7 7z"
                  fill="currentColor"
                />
              </svg>
            ),
            color: currentTheme.status.info,
            bgColor: currentTheme.status.info + "15",
          },
          {
            label: "Supprimer",
            onClick: () => onDelete(row),
            icon: (
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                <path
                  d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z"
                  fill="currentColor"
                />
              </svg>
            ),
            color: currentTheme.status.error,
            bgColor: currentTheme.status.error + "15",
          },
        ]),
  ];

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4
            className="text-sm font-semibold"
            style={{ color: currentTheme.text.primary }}>
            Actions disponibles
          </h4>
          <div
            className="px-2 py-1 rounded-full text-xs font-medium"
            style={{
              color: currentTheme.text.secondary,
              background: currentTheme.background.primary,
              border: `1px solid ${currentTheme.border.primary}`,
            }}>
            {actions.length} actions
          </div>
        </div>

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
              disabled={loading}>
              <div
                className="p-1.5 rounded-md"
                style={{
                  background: action.color + "20",
                }}>
                {action.icon}
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-4">
            <div
              className="animate-spin rounded-full h-6 w-6 border-b-2"
              style={{ borderColor: currentTheme.interactive.primary }}></div>
            <span
              className="ml-2 text-sm"
              style={{ color: currentTheme.text.secondary }}>
              Traitement en cours...
            </span>
          </div>
        )}
      </div>
      {resource.name === "products" && (
        <ProductDetailsModal
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          productId={(row as WithId)._id || (row as WithId).id || ''}
        />
      )}
    </>
  );
}
