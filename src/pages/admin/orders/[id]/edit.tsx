import AdminLayout from "@/components/admin/layout/AdminLayout";
import SectionHeader from "@/components/ui/SectionHeader";
import React from "react";
import { useRouter } from "next/router";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { fetchOrderById } from "@/services/orderService";
import { fetchDeliveryAgents } from "@/services/userService";
import { updateOrder } from "@/services/orderService";
import Image from "next/image";

// Define a type for the order object
interface EditOrderType {
  _id?: string;
  id?: string;
  orderId?: string;
  status: string;
  assignedTo?: { _id?: string } | string;
  address?: {
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  cancellationReason?: string;
  createdAt?: string;
  store?: { name?: string };
  products?: Array<Product>; // Add products as optional
}

interface DeliveryAgent {
  id: string;
  name: string;
}
interface Product {
  product: { name?: string; image?: string };
  quantity: number;
  price: number;
}

export default function EditOrder() {
  const router = useRouter();
  const { currentTheme } = useDarkMode();
  const { id } = router.query;
  const [isLoading, setIsLoading] = React.useState(false);
  const [order, setOrder] = React.useState<EditOrderType | null>(null);
  // In the form state, ensure all fields are strings
  const [form, setForm] = React.useState<{
    status: string;
    assignedTo: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    cancellationReason: string;
  }>({
    status: "",
    assignedTo: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cancellationReason: "",
  });
  const [deliveryAgents, setDeliveryAgents] = React.useState<DeliveryAgent[]>([]);
  const [saving, setSaving] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");

  // Allowed transitions (should match backend)
  const allowedTransitions: Record<string, string[]> = {
    pending: ["waiting_for_delivery", "cancelled"],
    waiting_for_delivery: ["delivering", "cancelled"],
    delivering: ["delivered", "cancelled"],
    delivered: [],
    cancelled: [],
  };
  const statusLabels: Record<string, string> = {
    pending: "En attente",
    waiting_for_delivery: "Confirmée",
    delivering: "Expédiée",
    delivered: "Livrée",
    cancelled: "Annulée",
  };

  React.useEffect(() => {
    if (id && typeof id === "string") {
      setIsLoading(true);
      fetchOrderById(id)
        .then((data: EditOrderType) => {
          setOrder(data);
          setForm({
            status: data.status || "",
            assignedTo: (data.assignedTo && typeof data.assignedTo === 'object') ? data.assignedTo._id || "" : (typeof data.assignedTo === 'string' ? data.assignedTo : ""),
            address: data.address?.address || "",
            city: data.address?.city || "",
            state: data.address?.state || "",
            zipCode: data.address?.zipCode || "",
            cancellationReason: data.cancellationReason || "",
          });
        })
        .catch(() => setOrder(null))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  React.useEffect(() => {
    fetchDeliveryAgents().then((agents: DeliveryAgent[]) => setDeliveryAgents(agents));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      // Only include changed fields
      const updateData: Partial<EditOrderType> = {};
      if (form.status !== order?.status) {
        updateData.status = form.status;
      }
      if (
        (form.assignedTo || "") !== ((order?.assignedTo && typeof order.assignedTo === 'object') ? order.assignedTo._id : order?.assignedTo || "")
      ) {
        updateData.assignedTo = form.assignedTo;
      }
      // Compare address fields
      const origAddress = order?.address || {};
      const addressChanged =
        (form.address || "") !== (origAddress.address || "") ||
        (form.city || "") !== (origAddress.city || "") ||
        (form.state || "") !== (origAddress.state || "") ||
        (form.zipCode || "") !== (origAddress.zipCode || "");
      if (addressChanged) {
        updateData.address = {
          address: form.address as string,
          city: form.city as string,
          state: form.state as string,
          zipCode: form.zipCode as string,
        };
      }
      if (form.status === "cancelled" && form.cancellationReason !== (order?.cancellationReason || "")) {
        updateData.cancellationReason = form.cancellationReason;
      }
      if (Object.keys(updateData).length === 0) {
        setErrorMsg("Aucune modification détectée.");
        setSaving(false);
        return;
      }
      await updateOrder(order?._id || order?.id || "", updateData);
      // Redirect to orders list on success
      router.push("/admin/orders");
    } catch (err: unknown) {
      let errorMsg = "Erreur lors de la mise à jour de la commande.";
      if (err instanceof Error && err.message) {
        errorMsg = err.message;
      } else if (typeof err === 'object' && err && 'response' in err && (err as { response?: { data?: { message?: string } } }).response?.data?.message) {
        errorMsg = (err as { response: { data: { message: string } } }).response.data.message;
      }
      setErrorMsg(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/orders");
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <p style={{ color: currentTheme.text.secondary }}>
              Chargement...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <p style={{ color: currentTheme.text.secondary }}>
              Commande non trouvée
            </p>
            <button
              onClick={handleCancel}
              className="mt-4 px-4 py-2 rounded-lg transition-colors"
              style={{
                background: currentTheme.interactive.primary,
                color: currentTheme.text.inverse,
              }}>
              Retour à la liste
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Compute allowed status options
  const statusOptions = [order.status, ...(allowedTransitions[order.status] || [])];

  return (
    <AdminLayout>
      <SectionHeader
        title="Modifier la commande"
        subtitle={`Commande n° ${order.orderId || order._id}`}
      />
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSave}>
          <div
            className="rounded-xl p-6"
            style={{
              background: currentTheme.background.card,
              border: `1px solid ${currentTheme.border.primary}`,
            }}>
            {/* Store and date (read-only) */}
            <div style={{ marginBottom: 16, color: currentTheme.text.primary }}>
              <strong style={{ color: currentTheme.text.primary }}>Client:</strong> {order.store?.name || "-"}
            </div>
            <div style={{ marginBottom: 16, color: currentTheme.text.primary }}>
              <strong style={{ color: currentTheme.text.primary }}>Date de création:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
            </div>
            {/* Editable fields */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: currentTheme.text.primary, fontWeight: 600 }}>Statut</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full mt-1 p-2 rounded border"
                style={{
                  background: currentTheme.background.secondary,
                  color: currentTheme.text.primary,
                  borderColor: currentTheme.border.primary,
                }}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {statusLabels[status] || status}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: currentTheme.text.primary, fontWeight: 600 }}>Assigné à</label>
              <select
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                className="w-full mt-1 p-2 rounded border"
                style={{
                  background: currentTheme.background.secondary,
                  color: currentTheme.text.primary,
                  borderColor: currentTheme.border.primary,
                }}
              >
                <option value="">Non assigné</option>
                {deliveryAgents.map((agent) => (
                  <option key={agent.id} value={agent.id}>{agent.name}</option>
                ))}
              </select>
            </div>
            {/* Address fields */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: currentTheme.text.primary, fontWeight: 600 }}>Adresse</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full mt-1 p-2 rounded border"
                style={{
                  background: currentTheme.background.secondary,
                  color: currentTheme.text.primary,
                  borderColor: currentTheme.border.primary,
                }}
                placeholder="Adresse"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" style={{ marginBottom: 16 }}>
              <div>
                <label style={{ color: currentTheme.text.primary, fontWeight: 600 }}>Ville</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 rounded border"
                  style={{
                    background: currentTheme.background.secondary,
                    color: currentTheme.text.primary,
                    borderColor: currentTheme.border.primary,
                  }}
                  placeholder="Ville"
                />
              </div>
              <div>
                <label style={{ color: currentTheme.text.primary, fontWeight: 600 }}>État</label>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 rounded border"
                  style={{
                    background: currentTheme.background.secondary,
                    color: currentTheme.text.primary,
                    borderColor: currentTheme.border.primary,
                  }}
                  placeholder="État"
                />
              </div>
              <div>
                <label style={{ color: currentTheme.text.primary, fontWeight: 600 }}>Code postal</label>
                <input
                  type="text"
                  name="zipCode"
                  value={form.zipCode}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 rounded border"
                  style={{
                    background: currentTheme.background.secondary,
                    color: currentTheme.text.primary,
                    borderColor: currentTheme.border.primary,
                  }}
                  placeholder="Code postal"
                />
              </div>
            </div>
            {/* Cancellation reason if cancelled */}
            {form.status === "cancelled" && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: currentTheme.text.primary, fontWeight: 600 }}>Raison de l&apos;annulation</label>
                <textarea
                  name="cancellationReason"
                  value={form.cancellationReason}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 rounded border"
                  style={{
                    background: currentTheme.background.secondary,
                    color: currentTheme.text.primary,
                    borderColor: currentTheme.border.primary,
                  }}
                  placeholder="Raison de l&apos;annulation"
                  rows={2}
                />
              </div>
            )}

            {/* Products section (read-only) */}
            <div style={{ margin: '32px 0 0 0' }}>
              <h3 style={{ color: currentTheme.text.primary, fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Produits de la commande</h3>
              {Array.isArray(order.products) && order.products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {order.products.map((item: Product, idx: number) => {
                    const product = item.product || {};
                    const image = product.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80';
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-4 rounded-lg p-3 border"
                        style={{
                          background: currentTheme.background.secondary,
                          borderColor: currentTheme.border.primary,
                          color: currentTheme.text.primary,
                        }}
                      >
                        <Image
                          src={image}
                          alt={product.name || 'Produit'}
                          width={64}
                          height={64}
                          style={{ objectFit: 'cover', borderRadius: 8, border: `1px solid ${currentTheme.border.primary}` }}
                        />
                        <div className="flex-1">
                          <div style={{ fontWeight: 600, fontSize: 16 }}>{product.name || 'Produit inconnu'}</div>
                          <div style={{ fontSize: 14, color: currentTheme.text.secondary }}>
                            Quantité : <span style={{ fontWeight: 500 }}>{item.quantity}</span>
                          </div>
                          <div style={{ fontSize: 14, color: currentTheme.text.secondary }}>
                            Prix unitaire : <span style={{ fontWeight: 500 }}>{item.price} €</span>
                          </div>
                          <div style={{ fontSize: 14, color: currentTheme.text.secondary }}>
                            Total : <span style={{ fontWeight: 600 }}>{(item.price * item.quantity).toFixed(2)} €</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ color: currentTheme.text.secondary }}>Aucun produit dans cette commande.</div>
              )}
            </div>

            {/* Save/Cancel/Feedback */}
            {successMsg && <div style={{ color: currentTheme.status.success, marginTop: 16 }}>{successMsg}</div>}
            {errorMsg && <div style={{ color: currentTheme.status.error, marginTop: 16 }}>{errorMsg}</div>}
            <div className="flex gap-4 mt-8">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 rounded-lg font-semibold transition-colors"
                style={{
                  background: currentTheme.interactive.primary,
                  color: currentTheme.text.inverse,
                  opacity: saving ? 0.7 : 1,
                  cursor: saving ? 'not-allowed' : 'pointer',
                }}
              >
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 rounded-lg font-semibold transition-colors"
                style={{
                  background: currentTheme.background.secondary,
                  color: currentTheme.text.primary,
                  border: `1px solid ${currentTheme.border.primary}`,
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
} 