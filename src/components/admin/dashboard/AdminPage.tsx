import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import SectionHeader from "@/components/ui/SectionHeader";
import SearchBar from "@/components/ui/SearchBar";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/Button";
import AdminActionBar from "@/components/admin/tables/AdminActionBar";
import BulkActionsDropdown from "@/components/admin/tables/BulkActionsDropdown";
import AdminTableContainer from "@/components/admin/tables/AdminTableContainer";
import ConfirmDeleteModal from "@/components/admin/modals/ConfirmDeleteModal";
import { AdminPageProps, BulkAction, TableColumn } from "@/types/admin";
import { formatCurrency } from "@/config/currency";
import Modal from "@/components/ui/Modal";
import NewOrderForm from "@/components/admin/forms/NewOrderForm";
import { createOrder } from "@/services/orderService";

export default function AdminPage<T extends { id: string }>({
  resource,
  data,
  selectedItems,
  onSelectItem,
  onSelectAll,
  onBulkAction,
  onDelete,
  loading = false,
  currentPage,
  totalPages,
  onPageChange,
  search,
  onSearchChange,
  filter,
  onFilterChange,
  subFilter,
  onSubFilterChange,
  sort,
  onSortChange,
  statsComponent,
  showSubFilter = false,
  renderExpandedContent,
  onAddOrder,
}: AdminPageProps<T> & {
  statsComponent?: React.ReactNode;
  subFilter?: string;
  onSubFilterChange?: (value: string) => void;
  showSubFilter?: boolean;
  renderExpandedContent?: (row: T) => React.ReactNode;
  onAddOrder?: () => void;
}) {
  const { currentTheme } = useDarkMode();
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [deletingItem, setDeletingItem] = React.useState<T | null>(null);
  const [expandedRows, setExpandedRows] = React.useState<string[]>([]);
  const [showAddOrderModal, setShowAddOrderModal] = React.useState(false);
  const [addOrderError, setAddOrderError] = React.useState<string | null>(null);
  const [addOrderSuccess, setAddOrderSuccess] = React.useState(false);

  const handleBulkAction = (action: string) => {
    onBulkAction(action, selectedItems);
  };

  // Helper function to render status badges
  const renderStatusBadge = (
    status: string,
    type: "order" | "payment" | "review" | "product" | "user" = "order",
  ) => {
    const statusConfig: Record<
      string,
      Record<string, { label: string; color: string }>
    > = {
      order: {
        pending: { label: "En attente", color: currentTheme.status.warning },
        waiting_for_delivery: { label: "Confirmée", color: currentTheme.status.info },
        delivering: { label: "Expédiée", color: currentTheme.status.warning },
        delivered: { label: "Livrée", color: currentTheme.status.success },
        cancelled: { label: "Annulée", color: currentTheme.status.error },
      },
      payment: {
        pending: { label: "En attente", color: currentTheme.status.warning },
        paid: { label: "Payé", color: currentTheme.status.success },
        failed: { label: "Échoué", color: currentTheme.status.error },
      },
      review: {
        pending: { label: "En attente", color: currentTheme.status.warning },
        approved: { label: "Approuvé", color: currentTheme.status.success },
        rejected: { label: "Rejeté", color: currentTheme.status.error },
      },
      product: {
        active: { label: "Actif", color: currentTheme.status.success },
        inactive: { label: "Inactif", color: currentTheme.status.warning },
        out_of_stock: {
          label: "Rupture de stock",
          color: currentTheme.status.error,
        },
        discontinued: {
          label: "Discontinué",
          color: currentTheme.status.error,
        },
        draft: { label: "Brouillon", color: currentTheme.text.secondary },
      },
      user: {
        active: { label: "Actif", color: currentTheme.status.success },
        actif: { label: "Actif", color: currentTheme.status.success },
        inactive: { label: "Inactif", color: currentTheme.status.warning },
        inactif: { label: "Inactif", color: currentTheme.status.warning },
        suspended: { label: "Suspendu", color: currentTheme.status.error },
        suspendu: { label: "Suspendu", color: currentTheme.status.error },
        deleted: { label: "Supprimé", color: currentTheme.text.muted },
        supprimé: { label: "Supprimé", color: currentTheme.text.muted },
      },
    };

    // Use user type for users resource
    let config;
    if (type === "user") {
      config = statusConfig.user[status];
    } else {
      config = statusConfig[type][status];
    }
    if (!config) {
      config = { label: status, color: currentTheme.text.secondary };
    }

    return (
      <span
        className="px-2 py-1 rounded-full text-xs font-medium"
        style={{
          color: config.color,
          background: config.color + "15",
          border: `1px solid ${config.color}30`,
        }}>
        {config.label}
      </span>
    );
  };



  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Helper function to format rating
  const formatRating = (rating: number) => {
    return `${rating.toFixed(1)}/5`;
  };

  // Process table columns with custom rendering
  const processedColumns = resource.tableColumns.map((column: TableColumn<T>) => {
    const baseColumn = { ...column };

    // Add custom rendering for specific fields
    if (column.accessor === "status") {
      // Determine status type based on the resource name
      let statusType: "order" | "payment" | "review" | "product" | "user" = "order";
      if (resource.name === "reviews") {
        statusType = "review";
      } else if (resource.name === "products") {
        statusType = "product";
      } else if (resource.name === "users") {
        statusType = "user";
      }
      baseColumn.render = (value: T[keyof T]) =>
        renderStatusBadge(String(value), statusType);
    } else if (column.accessor === "paymentStatus") {
      baseColumn.render = (value: T[keyof T]) =>
        renderStatusBadge(String(value), "payment");
    } else if (
      column.accessor === "totalAmount" ||
      column.accessor === "price"
    ) {
      baseColumn.render = (value: T[keyof T]) => formatCurrency(Number(value));
    } else if (column.accessor === "createdAt") {
      baseColumn.render = (value: T[keyof T]) => formatDate(String(value));
    } else if (column.accessor === "rating") {
      baseColumn.render = (value: T[keyof T]) => formatRating(Number(value));
    } else if (column.accessor === "isVerified") {
      baseColumn.render = (value: T[keyof T]) => {
        const isVerified = Boolean(value);
        return (
          <span
            className="px-2 py-1 rounded-full text-xs font-medium"
            style={{
              color: isVerified
                ? currentTheme.status.success
                : currentTheme.status.error,
              background:
                (isVerified
                  ? currentTheme.status.success
                  : currentTheme.status.error) + "15",
              border: `1px solid ${
                isVerified
                  ? currentTheme.status.success
                  : currentTheme.status.error
              }30`,
            }}>
            {isVerified ? "Vérifié" : "Non vérifié"}
          </span>
        );
      };
    }

    return baseColumn;
  });

  // Use processed columns without actions column for expandable rows
  const tableColumns = processedColumns;

  const bulkActions: BulkAction[] = resource.bulkActions.map((action: BulkAction) => ({
    label: action.label,
    value: action.value,
    icon: action.icon,
    onClick: () => handleBulkAction(action.value),
  }));

  return (
    <AdminLayout>
      <div className="admin-content w-full">
        {addOrderSuccess && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded shadow-lg text-lg font-semibold animate-fade-in-out">
            ✅ Commande créée avec succès !
          </div>
        )}
        <SectionHeader
          title={`Gestion des ${resource.displayName}`}
          subtitle={`Liste et gestion des ${resource.displayName} du site.`}
        />

        {/* Stats Component */}
        {statsComponent && <div className="mb-8">{statsComponent}</div>}

        {/* Search Bar */}
        <div className="w-full mb-6">
          <SearchBar
            searchValue={search}
            onSearchChange={onSearchChange}
            filterOptions={resource.searchOptions}
            selectedFilter={filter}
            onFilterChange={onFilterChange}
            subFilterOptions={resource.subFilterOptions}
            selectedSubFilter={subFilter}
            onSubFilterChange={onSubFilterChange}
            sortOptions={resource.sortOptions}
            selectedSort={sort}
            onSortChange={onSortChange}
            onSearchSubmit={() => {}}
            placeholder={`Rechercher des ${resource.displayName}...`}
            showSubFilter={showSubFilter}
          />
        </div>

        {/* Actions Row */}
        <AdminActionBar
          left={
            selectedItems.length > 0 ? (
              <BulkActionsDropdown
                count={selectedItems.length}
                actions={bulkActions}
                loading={loading}
                selectedIds={selectedItems}
                color={currentTheme.text.primary}
                borderColor={currentTheme.border.primary}
                bgColor={currentTheme.background.card}
              />
            ) : undefined
          }
          right={
            <>
              <Button
                // Remove any href or navigation logic
                onClick={() => setShowAddOrderModal(true)}
                className="px-6 py-2 font-semibold flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  color: currentTheme.text.inverse,
                  background: currentTheme.interactive.primary,
                  border: `1.5px solid ${currentTheme.interactive.primary}`,
                }}>
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 16 16"
                  className="mr-2">
                  <path
                    d="M8 2v12M2 8h12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="hidden sm:inline">{resource.addButtonText}</span>
                <span className="sm:hidden">Ajouter</span>
              </Button>
              <Modal
                isOpen={showAddOrderModal}
                onClose={() => setShowAddOrderModal(false)}
                title="Nouvelle commande"
                size="md"
              >
                {resource.name === "orders" ? (
                  <NewOrderForm
                    onCancel={() => setShowAddOrderModal(false)}
                    onSubmit={async (orderData: { clientId: string; address: string; city: string; state: string; zip: string; products: Array<{ productId: string; quantity: number }> }) => {
                      setAddOrderError(null);
                      try {
                        // Map fields to backend format
                        const payload = {
                          store: orderData.clientId,
                          address: {
                            address: orderData.address,
                            city: orderData.city,
                            state: orderData.state,
                            zipCode: orderData.zip,
                          },
                          products: orderData.products.map((p: { productId: string; quantity: number }) => ({
                            product: p.productId,
                            quantity: p.quantity,
                          })),
                        };
                        await createOrder(payload);
                        setShowAddOrderModal(false);
                        setAddOrderSuccess(true);
                        if (onAddOrder) onAddOrder();
                        setTimeout(() => setAddOrderSuccess(false), 3500);
                      } catch (err) {
                        setAddOrderError((err as Error).message || "Erreur lors de la création de la commande.");
                      }
                    }}
                  />
                ) : (
                  <NewOrderForm onCancel={() => setShowAddOrderModal(false)} />
                )}
                {addOrderError && (
                  <div style={{ color: 'red', marginTop: 8 }}>{addOrderError}</div>
                )}
              </Modal>
            </>
          }
        />

        {/* Table */}
        <AdminTableContainer borderColor={currentTheme.border.primary}>
          <Table
            columns={tableColumns}
            data={data}
            selectable={true}
            selectedRows={selectedItems}
            onRowSelect={onSelectItem}
            onSelectAll={onSelectAll}
            idField="id"
            expandable={true}
            expandedRows={expandedRows}
            onRowExpand={(id, expanded) => {
              if (expanded) {
                setExpandedRows((prev) => [...prev, id]);
              } else {
                setExpandedRows((prev) => prev.filter((rowId) => rowId !== id));
              }
            }}
            renderExpandedContent={renderExpandedContent}
          />
        </AdminTableContainer>

        {/* Pagination */}
        <div className="flex justify-center mb-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>

        {/* Delete Confirmation Modal */}
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeletingItem(null);
          }}
          onConfirm={() => {
            if (deletingItem) {
              onDelete(deletingItem);
              setShowDeleteModal(false);
              setDeletingItem(null);
            }
          }}
          loading={loading}
          userName={
            deletingItem
              ? resource.deleteConfirmationText(deletingItem)
              : undefined
          }
          textColor={currentTheme.text.primary}
          borderColor={currentTheme.border.primary}
          errorColor={currentTheme.status.error}
          secondaryTextColor={currentTheme.text.secondary}
        />
      </div>
    </AdminLayout>
  );
}
