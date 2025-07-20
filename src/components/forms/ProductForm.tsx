import React, { useState, useEffect } from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCategories } from "@/hooks/useCategories";
import { Product } from "@/types/product";
import { ImagePlus, X } from "lucide-react";
import { fetchTaxes, Tax } from "@/services/taxService";

interface ProductFormProps {
  product?: Partial<Product>;
  onSubmit: (data: any) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const statusOptions = [
  { value: "active", label: "Actif" },
  { value: "inactive", label: "Inactif" },
  { value: "out_of_stock", label: "Rupture de stock" },
  { value: "discontinued", label: "Discontinué" },
  { value: "draft", label: "Brouillon" },
];

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel, isLoading = false }) => {
  const { currentTheme } = useDarkMode();
  const { categoryTree, loading: categoriesLoading } = useCategories();
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [taxLoading, setTaxLoading] = useState(false);
  const [taxError, setTaxError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price ?? product?.pricePerBox ?? 0,
    stock: product?.stock ?? 0,
    image: product?.image || "",
    category: typeof product?.category === "object" && product?.category !== null && "_id" in product.category ? (product.category as any)._id : product?.category || "",
    status: product?.status || "active",
    tax: typeof product?.tax === "object" && product?.tax !== null && "id" in product.tax ? (product.tax as any).id : typeof product?.tax === "string" ? product.tax : "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    setForm({
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price ?? product?.pricePerBox ?? 0,
      stock: product?.stock ?? 0,
      image: product?.image || "",
      category: typeof product?.category === "object" && product?.category !== null && "_id" in product.category ? (product.category as any)._id : product?.category || "",
      status: product?.status || "active",
      tax: typeof product?.tax === "object" && product?.tax !== null && "id" in product.tax ? (product.tax as any).id : typeof product?.tax === "string" ? product.tax : "",
    });
  }, [product]);

  useEffect(() => {
    setTaxLoading(true);
    fetchTaxes()
      .then(setTaxes)
      .catch(() => setTaxError("Erreur lors du chargement des taxes."))
      .finally(() => setTaxLoading(false));
  }, []);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price || !form.category) return;
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };
    onSubmit(payload);
  };

  // Cloudinary upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL || "", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setForm((prev) => ({ ...prev, image: data.secure_url }));
      } else {
        setUploadError("Erreur lors de l'upload de l'image.");
      }
    } catch {
      setUploadError("Erreur lors de l'upload de l'image.");
    } finally {
      setUploading(false);
    }
  };

  // Recursive dropdown for categories
  const renderCategoryOptions = (nodes: any[], level = 0): React.ReactNode[] =>
    nodes.flatMap((cat) => [
      <option key={cat._id} value={cat._id}>
        {"- ".repeat(level) + cat.name}
      </option>,
      ...(cat.children ? renderCategoryOptions(cat.children, level + 1) : []),
    ]);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto bg-white dark:bg-gray-900 rounded-2xl p-4 md:p-6 space-y-8" style={{ background: currentTheme.background.card }}>
      <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: currentTheme.text.primary }}>Ajouter / Modifier un produit</h2>
      <div className="flex flex-col gap-6 items-center">
        <div className="w-full max-w-md mx-auto">
          <label className="block text-sm font-semibold mb-2" style={{ color: currentTheme.text.primary }}>
            Image du produit
          </label>
          {form.image ? (
            <div className="relative flex flex-col items-center justify-center w-full" style={{ maxWidth: 320 }}>
              <div className="relative w-36 h-36 mx-auto">
                <img src={form.image} alt="Aperçu" className="w-36 h-36 object-cover rounded border shadow mx-auto" />
                <button
                  type="button"
                  aria-label="Supprimer l'image"
                  className="absolute z-20 top-0 right-0 -translate-y-1/2 translate-x-1/2 bg-white dark:bg-gray-800 rounded-full p-1 border border-gray-300 dark:border-gray-700 shadow hover:bg-red-100 dark:hover:bg-red-900 transition"
                  style={{ color: currentTheme.status.error }}
                  onClick={() => setForm((prev) => ({ ...prev, image: "" }))}
                >
                  <X size={18} />
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-2">Image téléchargée</div>
            </div>
          ) : (
            <div
              className="rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 cursor-pointer transition hover:border-blue-400 focus-within:border-blue-400 relative min-h-[160px] w-full mx-auto"
              style={{ borderColor: currentTheme.border.primary, maxWidth: 320 }}
              tabIndex={0}
              onClick={() => document.getElementById('product-image-upload')?.click()}
              onKeyDown={e => { if (e.key === 'Enter') document.getElementById('product-image-upload')?.click(); }}
            >
              <input
                id="product-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading || isLoading}
                className="hidden"
              />
              <ImagePlus size={56} color={currentTheme.text.secondary} className="mb-3" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Cliquez pour choisir une image</span>
              {uploading && <div className="text-xs text-blue-600 mt-2">Upload en cours...</div>}
              {uploadError && <div className="text-xs text-red-600 mt-2 text-red-500">{uploadError}</div>}
            </div>
          )}
        </div>
        <div className="w-full max-w-md mx-auto">
          <label className="block text-sm font-semibold mb-2" style={{ color: currentTheme.text.primary }}>
            Nom du produit *
          </label>
          <Input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Entrez le nom du produit"
            required
            className="rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition w-full"
            style={{ borderColor: currentTheme.border.primary, background: currentTheme.background.primary, color: currentTheme.text.primary }}
          />
        </div>
        <div className="w-full max-w-md mx-auto flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-2" style={{ color: currentTheme.text.primary }}>
              Prix (€) *
            </label>
            <Input
              type="number"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
              placeholder="Prix du produit"
              min={0}
              step={0.01}
              required
              className="rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition w-full"
              style={{ borderColor: currentTheme.border.primary, background: currentTheme.background.primary, color: currentTheme.text.primary }}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-2" style={{ color: currentTheme.text.primary }}>
              Stock
            </label>
            <Input
              type="number"
              value={form.stock}
              onChange={(e) => handleChange("stock", e.target.value)}
              placeholder="Quantité en stock"
              min={0}
              step={1}
              className="rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition w-full"
              style={{ borderColor: currentTheme.border.primary, background: currentTheme.background.primary, color: currentTheme.text.primary }}
            />
          </div>
        </div>
        <div className="w-full max-w-md mx-auto">
          <label className="block text-sm font-semibold mb-2" style={{ color: currentTheme.text.primary }}>
            Catégorie principale *
          </label>
          <select
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-white dark:bg-gray-800"
            style={{ borderColor: currentTheme.border.primary, color: currentTheme.text.primary }}
            required
            disabled={categoriesLoading}
          >
            <option value="">Sélectionner une catégorie</option>
            {!categoriesLoading && renderCategoryOptions(categoryTree)}
          </select>
        </div>
        <div className="w-full max-w-md mx-auto">
          <label className="block text-sm font-semibold mb-2" style={{ color: currentTheme.text.primary }}>
            Statut
          </label>
          <select
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-white dark:bg-gray-800"
            style={{ borderColor: currentTheme.border.primary, color: currentTheme.text.primary }}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="w-full max-w-md mx-auto">
          <label className="block text-sm font-semibold mb-2" style={{ color: currentTheme.text.primary }}>
            Taxe
          </label>
          {taxLoading ? (
            <div className="text-xs text-gray-500">Chargement des taxes...</div>
          ) : taxError ? (
            <div className="text-xs text-red-600">{taxError}</div>
          ) : (
            <select
              className="rounded-lg border px-4 py-2 w-full"
              style={{ borderColor: currentTheme.border.primary, background: currentTheme.background.primary, color: currentTheme.text.primary }}
              value={form.tax}
              onChange={e => handleChange("tax", e.target.value)}
              disabled={isLoading}
            >
              <option value="">Aucune</option>
              {taxes.map(tax => (
                <option key={tax.id} value={tax.id}>
                  {tax.name} ({tax.rate}%)
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="w-full max-w-md mx-auto">
          <label className="block text-sm font-semibold mb-2" style={{ color: currentTheme.text.primary }}>
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Description du produit"
            className="w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white dark:bg-gray-800"
            style={{
              background: currentTheme.background.primary,
              color: currentTheme.text.primary,
              borderColor: currentTheme.border.primary,
            }}
            rows={3}
          />
        </div>
      </div>
      <div className="flex justify-end gap-4 pt-8 border-t w-full max-w-md mx-auto" style={{ borderColor: currentTheme.border.primary }}>
        <Button type="button" onClick={onCancel} className="px-6 py-2" style={{ color: currentTheme.text.secondary, background: "transparent", border: `1px solid ${currentTheme.border.primary}` }}>Annuler</Button>
        <Button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition">
          {product ? "Enregistrer" : "Ajouter"}
        </Button>
      </div>
      <style jsx global>{`
        /* Theme-aware custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          background: ${currentTheme.background.secondary};
        }
        ::-webkit-scrollbar-thumb {
          background: ${currentTheme.border.primary};
          border-radius: 8px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${currentTheme.interactive.primary};
        }
      `}</style>
    </form>
  );
};

export default ProductForm; 