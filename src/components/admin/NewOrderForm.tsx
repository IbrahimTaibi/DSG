import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { fetchUsers } from "@/services/userService";
import { fetchAllProducts } from "@/services/productService";
import AutocompleteInput from "../ui/AutocompleteInput";

interface ProductItem {
  productId: string;
  quantity: number;
}

interface Client {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: string;
}

interface Product {
  _id?: string;
  id?: string;
  name: string;
}

interface NewOrderFormSubmitData {
  clientId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  products: ProductItem[];
}

interface NewOrderFormProps {
  onCancel: () => void;
  onSubmit?: (data: NewOrderFormSubmitData) => void;
}

const NewOrderForm: React.FC<NewOrderFormProps> = ({ onCancel, onSubmit }) => {
  const { currentTheme } = useDarkMode();
  const [clientId, setClientId] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [zip, setZip] = React.useState("");
  const [products, setProducts] = React.useState<ProductItem[]>([
    { productId: "", quantity: 1 },
  ]);
  const [error, setError] = React.useState("");
  const [clients, setClients] = React.useState<Client[]>([]);
  const [productsList, setProductsList] = React.useState<Product[]>([]);
  const [loadingClients, setLoadingClients] = React.useState(true);
  const [loadingProducts, setLoadingProducts] = React.useState(true);
  const [fetchError, setFetchError] = React.useState("");

  React.useEffect(() => {
    setLoadingClients(true);
    fetchUsers()
      .then((users) => {
        setClients(
          users
            .filter((u) => u.role === "store" && typeof u.email === "string")
            .map((u) => ({ ...u, email: u.email as string }))
        );
        setLoadingClients(false);
      })
      .catch(() => {
        setFetchError("Erreur lors du chargement des clients.");
        setLoadingClients(false);
      });
    setLoadingProducts(true);
    fetchAllProducts(1, 100)
      .then((res) => {
        setProductsList(res.products || []);
        setLoadingProducts(false);
      })
      .catch(() => {
        setFetchError("Erreur lors du chargement des produits.");
        setLoadingProducts(false);
      });
  }, []);

  const handleProductChange = (idx: number, field: keyof ProductItem, value: string | number) => {
    setProducts((prev) =>
      prev.map((p, i) =>
        i === idx ? { ...p, [field]: field === "quantity" ? Number(value) : value } : p
      )
    );
  };

  const handleAddProduct = () => {
    setProducts((prev) => [...prev, { productId: "", quantity: 1 }]);
  };

  const handleRemoveProduct = (idx: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!clientId) return setError("Client requis");
    if (!address.trim() || !city.trim() || !state.trim() || !zip.trim()) return setError("Adresse complète requise");
    if (products.some((p) => !p.productId || p.quantity < 1)) return setError("Produit et quantité valides requis");
    if (onSubmit) onSubmit({ clientId, address, city, state, zip, products });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Client Autocomplete */}
        <AutocompleteInput
          label="Client"
          value={clientId}
          onChange={setClientId}
          options={clients.map((client) => ({
            label: `${client.name} (${client.email})`,
            value: client._id || client.id || "",
          }))}
          placeholder="Rechercher un client..."
          disabled={loadingClients}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Input
            label="Adresse"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Adresse"
            style={{ background: currentTheme.background.secondary, color: currentTheme.text.primary }}
          />
          <Input
            label="Ville"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ville"
            style={{ background: currentTheme.background.secondary, color: currentTheme.text.primary }}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input
            label="État"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="État"
            style={{ background: currentTheme.background.secondary, color: currentTheme.text.primary }}
          />
          <Input
            label="Code postal"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="Code postal"
            style={{ background: currentTheme.background.secondary, color: currentTheme.text.primary }}
          />
        </div>
        <div>
          <label style={{ color: currentTheme.text.primary, fontWeight: 600 }}>Produits</label>
          <div className="space-y-2 mt-2">
            {products.map((product, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <AutocompleteInput
                  value={product.productId}
                  onChange={(val) => handleProductChange(idx, "productId", val)}
                  options={productsList.map((prod) => ({
                    label: prod.name,
                    value: prod._id || prod.id || "",
                  }))}
                  placeholder="Rechercher un produit..."
                  disabled={loadingProducts}
                  style={{ minWidth: 180, flex: 1 }}
                />
                <Input
                  type="number"
                  min={1}
                  value={product.quantity}
                  onChange={(e) => handleProductChange(idx, "quantity", e.target.value)}
                  placeholder="Quantité"
                  style={{ background: currentTheme.background.secondary, color: currentTheme.text.primary, width: 80 }}
                />
                {products.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(idx)}
                    className="text-red-600 font-bold px-2"
                    style={{ fontSize: 20 }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <Button type="button" onClick={handleAddProduct} style={{ background: currentTheme.background.secondary, color: currentTheme.text.primary }}>
              + Ajouter un produit
            </Button>
          </div>
        </div>
        {(error || fetchError) && <div style={{ color: currentTheme.status.error }}>{error || fetchError}</div>}
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" onClick={onCancel} style={{ background: currentTheme.background.secondary, color: currentTheme.text.primary }}>
            Annuler
          </Button>
          <Button type="submit" style={{ background: currentTheme.interactive.primary, color: currentTheme.text.inverse }}>
            Créer la commande
          </Button>
        </div>
      </div>
    </form>
  );
};

export default NewOrderForm; 