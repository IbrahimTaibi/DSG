import React from "react";
import { useRouter } from "next/router";
import AdminPage from "@/components/admin/AdminPage";
import OrderStats from "@/components/admin/OrderStats";
import { ordersResource, Order } from "@/config/adminResources";
import { formatCurrency } from "@/config/currency";
import { fetchOrders, deleteOrder as apiDeleteOrder } from "@/services/orderService";
import ExpandedRowActions from "@/components/admin/ExpandedRowActions";

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

  const handlePrintInvoice = async (order: Order) => {
    try {
      // Create invoice content
      const invoiceContent = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Facture - ${order.orderNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: #f5f5f5;
              color: #333;
              line-height: 1.6;
              padding: 20px;
            }
            
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            
            .invoice-header {
              background: #2c3e50;
              color: white;
              padding: 40px;
              text-align: center;
            }
            
            .invoice-header h1 {
              font-size: 2.5rem;
              font-weight: 300;
              margin-bottom: 8px;
            }
            
            .invoice-header h2 {
              font-size: 1.4rem;
              font-weight: 400;
              margin-bottom: 4px;
              opacity: 0.9;
            }
            
            .invoice-header p {
              font-size: 1rem;
              opacity: 0.8;
            }
            
            .invoice-content {
              padding: 40px;
            }
            
            .invoice-details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
              margin-bottom: 40px;
              padding: 30px;
              background: #f8f9fa;
              border-radius: 6px;
            }
            
            .customer-info h3, .order-info h3 {
              color: #2c3e50;
              font-size: 1rem;
              margin-bottom: 16px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .customer-info p, .order-info p {
              margin-bottom: 8px;
              font-size: 0.95rem;
              color: #555;
            }
            
            .customer-info strong, .order-info strong {
              color: #2c3e50;
              font-weight: 600;
            }
            
            .invoice-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
              border: 1px solid #e1e5e9;
              border-radius: 6px;
              overflow: hidden;
            }
            
            .invoice-table th {
              background: #f8f9fa;
              color: #2c3e50;
              padding: 16px 12px;
              text-align: left;
              font-weight: 600;
              font-size: 0.9rem;
              border-bottom: 2px solid #e1e5e9;
            }
            
            .invoice-table td {
              padding: 16px 12px;
              border-bottom: 1px solid #e1e5e9;
              color: #555;
              font-size: 0.95rem;
            }
            
            .invoice-table tr:last-child td {
              border-bottom: none;
            }
            
            .total-section {
              background: #f8f9fa;
              padding: 16px 20px;
              border-radius: 6px;
              text-align: right;
              margin-bottom: 30px;
              border: 1px solid #e1e5e9;
            }
            
            .total-section h3 {
              font-size: 0.95rem;
              margin-bottom: 8px;
              font-weight: 600;
              color: #2c3e50;
            }
            
            .total-amount {
              font-size: 1.5rem;
              font-weight: 700;
              margin-bottom: 6px;
              color: #2c3e50;
            }
            
            .payment-status {
              display: inline-block;
              padding: 6px 12px;
              border-radius: 4px;
              font-size: 0.85rem;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .status-paid {
              background: #d4edda;
              color: #155724;
              border: 1px solid #c3e6cb;
            }
            
            .status-pending {
              background: #fff3cd;
              color: #856404;
              border: 1px solid #ffeaa7;
            }
            
            .status-failed {
              background: #f8d7da;
              color: #721c24;
              border: 1px solid #f5c6cb;
            }
            
            .footer {
              background: #f8f9fa;
              padding: 24px;
              text-align: center;
              border-radius: 6px;
              border: 1px solid #e1e5e9;
            }
            
            .footer h4 {
              color: #2c3e50;
              font-size: 1.1rem;
              margin-bottom: 12px;
              font-weight: 600;
            }
            
            .footer p {
              color: #6c757d;
              font-size: 0.95rem;
              margin-bottom: 16px;
            }
            
            .contact-info {
              display: flex;
              justify-content: center;
              gap: 24px;
              flex-wrap: wrap;
            }
            
            .contact-item {
              display: flex;
              align-items: center;
              gap: 6px;
              color: #6c757d;
              font-size: 0.9rem;
            }
            
            .map-link {
              display: flex;
              align-items: center;
              color: #6c757d;
              text-decoration: none;
              transition: color 0.2s ease;
            }
            
            .map-link:hover {
              color: #3498db;
            }
            
            @media print {
              body { 
                background: white; 
                padding: 0;
              }
              .invoice-container {
                box-shadow: none;
                border-radius: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="invoice-header">
              <h1>FACTURE</h1>
              <h2>DSG Wholesale Groceries</h2>
              <p>Grossiste en produits alimentaires</p>
            </div>
            
            <div class="invoice-content">
              <div class="invoice-details">
                <div class="customer-info">
                  <h3>Informations Client</h3>
                  <p><strong>Nom:</strong> ${order.clientName}</p>
                  <p><strong>Email:</strong> ${order.clientEmail}</p>
                  <p><strong>Type:</strong> Client professionnel</p>
                </div>
                <div class="order-info">
                  <h3>Détails de la Commande</h3>
                  <p><strong>N° Commande:</strong> ${order.orderNumber}</p>
                  <p><strong>Date:</strong> ${new Date(
                    order.createdAt,
                  ).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}</p>
                  <p><strong>Statut:</strong> ${order.status}</p>
                  <p><strong>Livraison:</strong> ${new Date(
                    order.deliveryDate,
                  ).toLocaleDateString("fr-FR")}</p>
                </div>
              </div>
              
              <table class="invoice-table">
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Quantité</th>
                    <th>Prix unitaire</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Commande de produits alimentaires</strong><br><small>Assortiment de produits frais et secs</small></td>
                    <td>1</td>
                    <td>${formatCurrency(order.totalAmount)}</td>
                    <td><strong>${formatCurrency(order.totalAmount)}</strong></td>
                  </tr>
                </tbody>
              </table>
              
              <div class="total-section">
                <h3>Montant Total</h3>
                <div class="total-amount">${formatCurrency(order.totalAmount)}</div>
                <div class="payment-status status-${
                  order.paymentStatus === "payé"
                    ? "paid"
                    : order.paymentStatus === "en attente"
                    ? "pending"
                    : "failed"
                }">
                  ${
                    order.paymentStatus === "payé"
                      ? "Payé"
                      : order.paymentStatus === "en attente"
                      ? "En attente"
                      : "Échoué"
                  }
                </div>
              </div>
              
              <div class="footer">
                                  <div class="contact-info">
                    <div class="contact-item">01 23 45 67 89</div>
                    <div class="contact-item">contact@dsg-groceries.fr</div>
                    <div class="contact-item">
                      <a href="https://maps.google.com/?q=Paris,France" target="_blank" class="map-link">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="margin-right: 4px;">
                          <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                        </svg>
                        Paris, France
                      </a>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      // Create a new window for printing
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(invoiceContent);
        printWindow.document.close();
        printWindow.focus();

        // Wait for content to load then print
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      }
    } catch (error) {
      console.error("Error printing invoice:", error);
      alert("Erreur lors de l'impression de la facture");
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
        renderExpandedContent={(row) => (
          <ExpandedRowActions
            row={row}
            resource={ordersResource}
            onPrintInvoice={handlePrintInvoice}
            onToggleStatus={handleToggleStatus}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={isLoading}
            onOrderStatusChange={(newStatus) => updateOrderInState(row.id, newStatus)}
          />
        )}
        onAddOrder={fetchAndSetOrders}
      />
    </>
  );
}
