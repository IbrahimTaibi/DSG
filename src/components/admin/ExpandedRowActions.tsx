import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { AdminResource } from "@/types/admin";
import ProductDetailsModal from "../ui/ProductDetailsModal";
import { useRouter } from "next/router";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { fetchDeliveryAgents, assignDeliveryAgent, updateOrderStatus } from "@/services/userService";
import { DeliveryAgent as BaseDeliveryAgent } from "@/services/userService";
import OrderStatusChangeModal from "@/components/admin/OrderStatusChangeModal";
import ErrorModal from "@/components/ui/ErrorModal";
import DeliveryAgentSelector from "@/components/admin/DeliveryAgentSelector";
import AdminActionButtons from "@/components/admin/AdminActionButtons";

interface DeliveryAgent extends BaseDeliveryAgent {
  _id?: string;
  email?: string;
}

interface ExpandedRowActionsProps<T> {
  row: T;
  resource: AdminResource<T>;
  onPrintInvoice?: (item: T) => void;
  onToggleStatus?: (item: T) => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  loading: boolean;
  onOrderStatusChange?: (newStatus: string) => void;
}

// Helper type for objects that might have _id or id
interface WithId {
  _id?: string;
  id?: string;
}

// Update the generic definition to require status and id
interface HasStatusAndId {
  status: string;
  id: string;
}

// Add this type for backend agent response
type BackendAgent = { _id: string; id?: string; name: string; email?: string; status?: string };

export default function ExpandedRowActions<T extends HasStatusAndId>({
  row,
  resource,
  onPrintInvoice,
  onToggleStatus,
  onEdit,
  onDelete,
  loading,
  onOrderStatusChange,
}: ExpandedRowActionsProps<T>) {
  const { currentTheme } = useDarkMode();
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const router = useRouter();
  // Delivery agent modal state
  const [assignModalOpen, setAssignModalOpen] = React.useState(false);
  const [deliveryAgents, setDeliveryAgents] = React.useState<DeliveryAgent[]>([]);
  const [search, setSearch] = React.useState("");
  const [loadingAgents, setLoadingAgents] = React.useState(false);
  const [selectedAgentId, setSelectedAgentId] = React.useState<string>("");
  const [assigning, setAssigning] = React.useState(false);
  const [assignError, setAssignError] = React.useState<string | null>(null);
  // Order status modal state
  const [statusModalOpen, setStatusModalOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<string>("");
  const [statusLoading, setStatusLoading] = React.useState(false);
  // Error modal state
  const [errorModalOpen, setErrorModalOpen] = React.useState(false);
  const [errorModalMsg, setErrorModalMsg] = React.useState<string>("");
  const [errorModalTitle, setErrorModalTitle] = React.useState<string>("Erreur de transition de statut");

  // Allowed transitions map (should match backend)
  const allowedTransitions: Record<string, string[]> = {
    pending: ["waiting_for_delivery", "cancelled"],
    waiting_for_delivery: ["delivering", "cancelled"],
    delivering: ["delivered", "cancelled"],
    delivered: [],
    cancelled: [],
  };

  // Helper to get assigned agent id from row
  const getAssignedAgentId = React.useCallback(() => {
    const assigned = (row as { assignedTo?: { _id?: string } | string });
    if (!assigned || !assigned.assignedTo) return '';
    if (typeof assigned.assignedTo === 'object' && assigned.assignedTo._id) return assigned.assignedTo._id;
    if (typeof assigned.assignedTo === 'string') return assigned.assignedTo;
    return '';
  }, [row]);

  // Open modal and fetch agents
  const handleOpenAssignModal = () => {
    setAssignModalOpen(true);
  };

  // Fetch delivery agents when modal opens
  React.useEffect(() => {
    if (assignModalOpen) {
      setLoadingAgents(true);
      (fetchDeliveryAgents() as unknown as Promise<BackendAgent[]>)
        .then((agents) => {
          const mappedAgents: DeliveryAgent[] = agents.map(agent => ({
            ...agent,
            id: agent._id || agent.id || '' // always use _id from backend, fallback to id
          }));
          setDeliveryAgents(mappedAgents);
        })
        .finally(() => setLoadingAgents(false));
    }
  }, [assignModalOpen, getAssignedAgentId]);

  // Set selected agent id after agents are loaded and modal is open
  React.useEffect(() => {
    if (assignModalOpen && deliveryAgents.length > 0) {
      setSelectedAgentId(getAssignedAgentId());
    }
  }, [assignModalOpen, deliveryAgents]);

  // Filtered agents
  const filteredAgents = deliveryAgents
    .filter(agent => agent.id && /^[a-fA-F0-9]{24}$/.test(agent.id))
    .filter(agent => {
      const searchTerm = search.trim().toLowerCase();
      if (!searchTerm) return true;
      const name = agent.name?.toLowerCase() || "";
      const email = agent.email?.toLowerCase() || "";
      return name.includes(searchTerm) || email.includes(searchTerm);
    });

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
        // Compose address string (use all available fields, comma-separated)
        const addressObj = (row as any).address || {};
        const addressParts = Object.values(addressObj).filter(Boolean);
        const addressString = addressParts.join(", ");
        baseActions.push({
          label: (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>Voir l'adresse</span>
              {addressString && (
                <span style={{ marginLeft: 8, color: currentTheme.text.secondary, fontSize: 11, opacity: 0.7, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }} title={addressString}>
                  {addressString}
                </span>
              )}
            </span>
          ),
          onClick: () => {
            // Open Google Maps with the address if available, fallback to Paris,France
            const mapsQuery = addressString ? encodeURIComponent(addressString) : "Paris,France";
            window.open(`https://maps.google.com/?q=${mapsQuery}`, "_blank");
          },
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
        // Store addressString for rendering next to the button
        (baseActions as any).addressString = addressString;
        // Assign to delivery agent button (only if not delivered/cancelled)
        if ((row as T).status !== "delivered" && (row as T).status !== "cancelled") {
          baseActions.push({
            label: "Assigner à un livreur",
            onClick: handleOpenAssignModal,
            icon: (
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                <path d="M8 2a6 6 0 100 12A6 6 0 008 2zm0 10a4 4 0 110-8 4 4 0 010 8z" fill="currentColor" />
                <path d="M12 14v-1a4 4 0 00-8 0v1" stroke="currentColor" strokeWidth="1" fill="none" />
              </svg>
            ),
            color: "#3B82F6",
            bgColor: "#3B82F6" + "15",
          });
        }
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

  // Handler for Changer le statut
  const handleOrderStatusChange = () => {
    setSelectedStatus((row as T).status);
    setStatusModalOpen(true);
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
                  onClick: handleOrderStatusChange,
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

  // Debug logs for troubleshooting
  React.useEffect(() => {
    if (assignModalOpen) {
      console.log('deliveryAgents', deliveryAgents);
      const filteredAgents = deliveryAgents.filter(agent => {
        const searchTerm = search.trim().toLowerCase();
        if (!searchTerm) return true;
        const name = agent.name?.toLowerCase() || "";
        const email = agent.email?.toLowerCase() || "";
        return name.includes(searchTerm) || email.includes(searchTerm);
      });
      console.log('filteredAgents', filteredAgents);
    }
  }, [assignModalOpen, deliveryAgents, search]);

  return (
    <>
      {/* Assign Delivery Agent Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Assigner à un livreur"
        size="md"
        loading={loadingAgents}
      >
        <DeliveryAgentSelector
          agents={deliveryAgents}
          selectedAgentId={selectedAgentId}
          onSelect={setSelectedAgentId}
          loading={loadingAgents}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
          <button
            onClick={() => setAssignModalOpen(false)}
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              border: 'none',
              background: currentTheme.background.secondary,
              color: currentTheme.text.primary,
              fontWeight: 500,
              marginRight: 8,
              cursor: 'pointer',
            }}
          >
            Annuler
          </button>
          <button
            onClick={async () => {
              if (selectedAgentId) {
                setAssigning(true);
                setAssignError(null);
                try {
                  await assignDeliveryAgent((row as T).id, selectedAgentId);
                  setAssignModalOpen(false);
                  if (onOrderStatusChange) onOrderStatusChange('refresh');
                } catch (err: unknown) {
                  if (err instanceof Error) {
                    setAssignError("Erreur lors de l'assignation. Veuillez réessayer.");
                  } else {
                    setAssignError("Erreur inconnue lors de l'assignation.");
                  }
                } finally {
                  setAssigning(false);
                }
              }
            }}
            disabled={!selectedAgentId || assigning}
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              border: 'none',
              background: currentTheme.status.info,
              color: '#fff',
              fontWeight: 600,
              cursor: selectedAgentId ? 'pointer' : 'not-allowed',
              opacity: selectedAgentId ? 1 : 0.7,
            }}
          >
            {assigning ? 'Assignation...' : 'Assigner'}
          </button>
        </div>
        {assignError && (
          <div style={{ color: currentTheme.status.error, marginTop: 12, textAlign: 'right' }}>{assignError}</div>
        )}
      </Modal>
      {/* Order Status Change Modal */}
      <OrderStatusChangeModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        currentStatus={(row as T).status}
        selectedStatus={selectedStatus}
        options={[
          { label: "En attente", value: "pending" },
          { label: "Confirmée", value: "waiting_for_delivery" },
          { label: "Expédiée", value: "delivering" },
          { label: "Livrée", value: "delivered" },
          { label: "Annulée", value: "cancelled" },
        ].filter(opt =>
          opt.value === (row as T).status || allowedTransitions[(row as T).status]?.includes(opt.value)
        )}
        onChange={setSelectedStatus}
        onConfirm={async () => {
          setStatusLoading(true);
          try {
            await updateOrderStatus((row as T).id, selectedStatus);
            setStatusModalOpen(false);
            if (onOrderStatusChange) onOrderStatusChange('refresh');
          } catch (err: unknown) {
            if (err instanceof Error) {
              let msg = "Changement de statut non autorisé.";
              if (err.message) {
                msg = err.message;
              }
              const current = (row as T).status;
              const allowed = allowedTransitions[current] || [];
              const statusLabels: Record<string, string> = {
                pending: "En attente",
                waiting_for_delivery: "Confirmée",
                delivering: "Expédiée",
                delivered: "Livrée",
                cancelled: "Annulée",
              };
              setErrorModalTitle("Erreur de transition de statut");
              setErrorModalMsg(
                msg +
                  (allowed.length
                    ? `\n\nTransitions autorisées depuis \"${statusLabels[current] || current}\":\n- ` +
                      allowed.map(a => statusLabels[a] || a).join("\n- ")
                    : "\n\nAucune transition n'est autorisée depuis ce statut.")
              );
              setErrorModalOpen(true);
            } else {
              setErrorModalTitle("Erreur inconnue");
              setErrorModalMsg("Une erreur inconnue s'est produite lors du changement de statut.");
              setErrorModalOpen(true);
            }
          } finally {
            setStatusLoading(false);
          }
        }}
        loading={statusLoading}
        title="Changer le statut de la commande"
      />
      <ErrorModal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        title={errorModalTitle}
        message={errorModalMsg}
        size="sm"
      />
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

        <AdminActionButtons actions={actions} loading={loading} />

        {/* Show address next to the Voir l'adresse button for orders */}
        {resource.name === "orders" && (actions as any).addressString && (
          <div style={{ marginTop: 8, marginLeft: 2, color: currentTheme.text.secondary, fontSize: 13 }}>
            {(actions as any).addressString}
          </div>
        )}

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
          product={{ id: (row as WithId)._id || (row as WithId).id || '' }}
        />
      )}
    </>
  );
}
