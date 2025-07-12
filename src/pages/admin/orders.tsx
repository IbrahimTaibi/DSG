import React from "react";
import { useRouter } from "next/router";
import AdminPage from "@/components/admin/AdminPage";
import OrderStats from "@/components/admin/OrderStats";
import { ordersResource, Order } from "@/config/adminResources";
import { formatCurrency } from "@/config/currency";

// Mock data (replace with real API calls)
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    clientName: "Alice Martin",
    clientEmail: "alice@email.com",
    status: "confirmée",
    totalAmount: 150.0,
    createdAt: "2024-01-15",
    deliveryDate: "2024-01-20",
    paymentStatus: "payé",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    clientName: "Bob Dupont",
    clientEmail: "bob@email.com",
    status: "expédiée",
    totalAmount: 80.0,
    createdAt: "2024-01-16",
    deliveryDate: "2024-01-18",
    paymentStatus: "payé",
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    clientName: "Charlie Durand",
    clientEmail: "charlie@email.com",
    status: "en attente",
    totalAmount: 120.0,
    createdAt: "2024-01-17",
    deliveryDate: "2024-01-22",
    paymentStatus: "en attente",
  },
  {
    id: "4",
    orderNumber: "ORD-2024-004",
    clientName: "Diane Leroy",
    clientEmail: "diane@email.com",
    status: "livrée",
    totalAmount: 200.0,
    createdAt: "2024-01-14",
    deliveryDate: "2024-01-16",
    paymentStatus: "payé",
  },
  {
    id: "5",
    orderNumber: "ORD-2024-005",
    clientName: "Eve Moreau",
    clientEmail: "eve@email.com",
    status: "annulée",
    totalAmount: 60.0,
    createdAt: "2024-01-13",
    deliveryDate: "2024-01-15",
    paymentStatus: "échoué",
  },
  {
    id: "6",
    orderNumber: "ORD-2024-006",
    clientName: "Frank Dubois",
    clientEmail: "frank@email.com",
    status: "confirmée",
    totalAmount: 90.0,
    createdAt: "2024-01-18",
    deliveryDate: "2024-01-25",
    paymentStatus: "payé",
  },
  {
    id: "7",
    orderNumber: "ORD-2024-007",
    clientName: "Grace Petit",
    clientEmail: "grace@email.com",
    status: "expédiée",
    totalAmount: 350.0,
    createdAt: "2024-01-12",
    deliveryDate: "2024-01-19",
    paymentStatus: "payé",
  },
  {
    id: "8",
    orderNumber: "ORD-2024-008",
    clientName: "Henri Rousseau",
    clientEmail: "henri@email.com",
    status: "en attente",
    totalAmount: 45.0,
    createdAt: "2024-01-19",
    deliveryDate: "2024-01-21",
    paymentStatus: "en attente",
  },
];

export default function AdminOrders() {
  const router = useRouter();

  // State management
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const [sort, setSort] = React.useState("date-desc");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedOrders, setSelectedOrders] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const itemsPerPage = 10;

  // Filter and sort orders
  let filteredOrders = mockOrders.filter((order) => {
    if (filter === "all") return true;
    if (filter === "en attente") return order.status === "en attente";
    if (filter === "confirmée") return order.status === "confirmée";
    if (filter === "expédiée") return order.status === "expédiée";
    if (filter === "livrée") return order.status === "livrée";
    if (filter === "annulée") return order.status === "annulée";
    if (filter === "paiement_en_attente")
      return order.paymentStatus === "en attente";
    if (filter === "paiement_payé") return order.paymentStatus === "payé";
    return true;
  });

  filteredOrders = filteredOrders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.clientName.toLowerCase().includes(search.toLowerCase()) ||
      order.clientEmail.toLowerCase().includes(search.toLowerCase()),
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
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log(`Delete order ${order.id}`);
    } catch (error) {
      console.error("Error deleting order:", error);
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
  const totalOrders = mockOrders.length;
  const pendingOrders = mockOrders.filter(
    (order) => order.status === "en attente",
  ).length;
  const completedOrders = mockOrders.filter(
    (order) => order.status === "livrée",
  ).length;
  const totalRevenue = mockOrders
    .filter((order) => order.paymentStatus === "payé")
    .reduce((sum, order) => sum + order.totalAmount, 0);

  return (
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
      onPrintInvoice={handlePrintInvoice}
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
    />
  );
}
