import React, { useState } from "react";
import { useRouter } from "next/router";
import AdminPage from "@/components/admin/dashboard/AdminPage";
import OrderStats from "@/components/admin/stats/OrderStats";
import { ordersResource, Order } from "@/config/adminResources";
import { fetchOrders, deleteOrder as apiDeleteOrder } from "@/services/orderService";
import ExpandedRowActions from "@/components/admin/tables/ExpandedRowActions";
import { ThermalPrinter, printToBrowser } from "@/utils/thermalPrinter";

// Define a type for the backend order object
interface BackendOrder {
  _id?: string;
  id?: string;
  orderId?: string;
  orderNumber?: string;
  store?: { name?: string; email?: string };
  status: string;
  total?: number;
  createdAt?: string;
  deliveryDate?: string;
  assignedTo?: { name?: string };
  deleted?: boolean;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
}

export default function AdminOrders() {
  const router = useRouter();

  // State management
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const [sort, setSort] = React.useState("date-desc");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedOrders, setSelectedOrders] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [invoiceError, setInvoiceError] = useState<string | null>(null);

  const itemsPerPage = 10;

  // Helper to fetch and set orders
  const fetchAndSetOrders = React.useCallback(() => {
    setIsLoading(true);
    fetchOrders()
      .then((data) => {
        const mapped = Array.isArray(data) ? data.map((order: BackendOrder) => ({
          id: order._id || order.id || '',
          orderNumber: order.orderId || order.orderNumber || '',
          clientName: order.store?.name || '',
          clientEmail: order.store?.email || '',
          status: order.status, // keep backend value
          statusLabel: mapOrderStatus(order.status), // for display
          totalAmount: order.total || 0,
          createdAt: order.createdAt || '',
          deliveryDate: order.deliveryDate || '',
          paymentStatus: mapPaymentStatus(order.status) as Order["paymentStatus"],
          assignedToName: order.assignedTo?.name || '',
          deleted: order.deleted,
          address: order.address || {}, // <-- add this line
        })) as Order[] : [];
        setOrders(mapped);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to fetch orders");
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Update order in state after status change or assignment
  const updateOrderInState = (orderId: string, newStatus: string) => {
    if (newStatus === 'refresh') {
      fetchAndSetOrders();
      return;
    }
    // (Legacy: local update, not used anymore)
    // setOrders((prevOrders) =>
    //   prevOrders.map((order) =>
    //     order.id === orderId
    //       ? { ...order, status: newStatus, statusLabel: mapOrderStatus(newStatus) } as Order & { statusLabel: string }
    //       : order
    //   )
    // );
  };

  // Helper to map backend status to frontend status
  function mapOrderStatus(status: string) {
    switch (status) {
      case 'pending': return 'En attente';
      case 'waiting_for_delivery': return 'Confirmée';
      case 'delivering': return 'Expédiée';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  }

  // Helper to map backend status to payment status (simple logic, adjust as needed)
  function mapPaymentStatus(status: string) {
    switch (status) {
      case 'delivered': return 'payé';
      case 'pending':
      case 'waiting_for_delivery':
      case 'delivering': return 'en attente';
      case 'cancelled': return 'échoué';
      default: return 'en attente';
    }
  }

  // Map French status labels to backend status keys
  const statusLabelToKey: Record<string, string> = {
    "en attente": "pending",
    "confirmée": "waiting_for_delivery",
    "expédiée": "delivering",
    "livrée": "delivered",
    "annulée": "cancelled",
  };

  // Fetch orders from backend
  React.useEffect(() => {
    fetchAndSetOrders();
  }, [fetchAndSetOrders]);

  // Filter and sort orders
  let filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    if (statusLabelToKey[filter]) return order.status === statusLabelToKey[filter];
    if (filter === "paiement_en_attente")
      return order.paymentStatus === "en attente";
    if (filter === "paiement_payé") return order.paymentStatus === "payé";
    return true;
  });

  filteredOrders = filteredOrders.filter(
    (order) =>
      (order.orderNumber?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (order.clientName?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (order.clientEmail?.toLowerCase() || "").includes(search.toLowerCase()),
  );

  filteredOrders = filteredOrders.sort((a, b) => {
    if (sort === "date-desc")
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sort === "date-asc")
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sort === "amount-asc") return a.totalAmount - b.totalAmount;
    if (sort === "amount-desc") return b.totalAmount - a.totalAmount;
    if (sort === "orderNumber-asc")
      return a.orderNumber.localeCompare(b.orderNumber);
    if (sort === "customer-asc")
      return a.clientName.localeCompare(b.clientName);
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Handlers
  const handleRowSelect = (orderId: string, selected: boolean) => {
    if (selected) {
      setSelectedOrders((prev) => [...prev, orderId]);
    } else {
      setSelectedOrders((prev) => prev.filter((id) => id !== orderId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedOrders(paginatedOrders.map((order) => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleBulkAction = async (action: string, selectedIds: string[]) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log(`Bulk action ${action} for orders:`, selectedIds);
      setSelectedOrders([]);
    } catch (error) {
      console.error("Error performing bulk action:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (order: Order) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiDeleteOrder(order.id);
      fetchAndSetOrders();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erreur lors de la suppression de la commande.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (order: Order) => {
    router.push(`/admin/orders/${order.id}/edit`);
  };

  const handleToggleStatus = async (order: Order) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log(`Toggle status for order ${order.id}`);
    } catch (error) {
      console.error("Error toggling order status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Print invoice handler
  const handlePrintInvoice = async (order: Order, printerType?: 'big' | 'small') => {
    if (printerType === 'small') {
      setInvoiceError(null);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
        const res = await fetch(`${API_BASE_URL}/api/orders/${order.id}/invoice`, {
          credentials: 'include',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error('Erreur lors de la récupération de la facture');
        const data = await res.json();
        
        // Print directly to thermal printer
        await printThermalInvoice(data);
        
      } catch (err: any) {
        setInvoiceError(err.message || 'Erreur inconnue');
      } finally {
        // setInvoiceLoading(false); // Removed as per edit hint
      }
      return;
    }
    
    // For big printer - use standard printer formatting
    if (printerType === 'big') {
      setInvoiceError(null);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
        const res = await fetch(`${API_BASE_URL}/api/orders/${order.id}/invoice`, {
          credentials: 'include',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error('Erreur lors de la récupération de la facture');
        const data = await res.json();
        
        // Print with standard printer formatting
        await printToBrowser(data, 'standard');
        
      } catch (err: any) {
        setInvoiceError(err.message || 'Erreur inconnue');
      } finally {
        // setInvoiceLoading(false); // Removed as per edit hint
      }
      return;
    }
  };

  // Handle thermal printer print
  const printThermalInvoice = async (invoiceData: any) => {
    try {
      // Try to connect to real thermal printer first
      const printer = new ThermalPrinter();
      await printer.connect();
      
      if (printer.isConnected) {
        // Real thermal printer connected
        await printer.printInvoice(invoiceData);
        await printer.disconnect();
      } else {
        // No thermal printer connected, offer browser printing
        const useBrowserPrint = confirm(
          'Aucune imprimante thermique connectée.\n\n' +
          'Options:\n' +
          '• Cliquez "OK" pour imprimer via le navigateur (test)\n' +
          '• Cliquez "Annuler" pour voir les commandes ESC/POS dans la console'
        );
        
        if (useBrowserPrint) {
          await printToBrowser(invoiceData, 'thermal');
        } else {
          // Show ESC/POS commands in console for debugging
          console.log('=== ESC/POS Commands for Thermal Printer ===');
          console.log('Invoice Data:', invoiceData);
          alert('Commandes ESC/POS affichées dans la console (F12)');
        }
      }
      
    } catch (error) {
      console.error('Erreur d\'impression:', error);
      alert('Erreur lors de l\'impression thermique');
    }
  };

  // Calculate stats for OrderStats component
  const nonDeletedOrders = orders.filter(order => !order.deleted);
  const totalOrders = nonDeletedOrders.length;
  const pendingOrders = nonDeletedOrders.filter(
    (order) => order.status === "pending",
  ).length;
  const completedOrders = nonDeletedOrders.filter(
    (order) => order.status === "delivered",
  ).length;
  const totalRevenue = nonDeletedOrders
    .filter((order) => order.paymentStatus === "payé")
    .reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <>
      {error && (
        <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>
      )}
      <AdminPage
        resource={ordersResource}
        data={paginatedOrders}
        selectedItems={selectedOrders}
        onSelectItem={handleRowSelect}
        onSelectAll={handleSelectAll}
        onBulkAction={handleBulkAction}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        loading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        sort={sort}
        onSortChange={setSort}
        statsComponent={
          <OrderStats
            totalOrders={totalOrders}
            pendingOrders={pendingOrders}
            completedOrders={completedOrders}
            totalRevenue={totalRevenue}
          />
        }
        renderExpandedContent={(row: Order) => (
          <>
            <ExpandedRowActions
              row={row}
              resource={ordersResource}
              onToggleStatus={handleToggleStatus}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={isLoading}
              onOrderStatusChange={(newStatus) => updateOrderInState(row.id, newStatus)}
              onPrintInvoice={handlePrintInvoice}
            />
            {/* Error Modal */}
            {invoiceError && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}>
                <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 320, maxWidth: 480 }}>
                  <h2 style={{ marginBottom: 16 }}>Erreur</h2>
                  <div style={{ color: 'red', marginBottom: 16 }}>{invoiceError}</div>
                  <button
                    style={{ padding: '8px 16px', borderRadius: 4, border: 'none', background: '#eee', cursor: 'pointer' }}
                    onClick={() => { setInvoiceError(null); }}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        onAddOrder={fetchAndSetOrders}
      />
    </>
  );
}
