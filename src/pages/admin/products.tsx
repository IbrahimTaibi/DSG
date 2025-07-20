import React from "react";
import AdminPage from "@/components/admin/dashboard/AdminPage";
import ProductStats from "@/components/admin/stats/ProductStats";
import { productsResource } from "@/config/adminResources";
import { fetchAllProducts } from "@/services/productService";
import { Product } from "@/types/product";
import ProductForm from "@/components/forms/ProductForm";
import { createProduct, deleteProduct, updateProduct, updateProductStatus } from "@/services/productService";
import Modal from "@/components/ui/Modal";
import ExpandedRowActions from "@/components/admin/tables/ExpandedRowActions";

// Add HasStatusAndId type for compatibility
interface HasStatusAndId {
  status: string;
  id: string;
}

export default function AdminProducts() {
  // State management
  const [products, setProducts] = React.useState<Product[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const [sort, setSort] = React.useState("date-desc");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [totalProducts, setTotalProducts] = React.useState(0);
  const itemsPerPage = 10;

  // Stats
  const [activeProducts, setActiveProducts] = React.useState(0);
  const [averageRating, setAverageRating] = React.useState(0);
  const [totalStock, setTotalStock] = React.useState(0);

  // Add product modal state
  const [showAddProductModal, setShowAddProductModal] = React.useState(false);
  const [addProductError, setAddProductError] = React.useState<string | null>(null);
  const [addProductSuccess, setAddProductSuccess] = React.useState(false);

  // Edit product modal state
  const [showEditProductModal, setShowEditProductModal] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [editProductError, setEditProductError] = React.useState<string | null>(null);
  const [editProductSuccess, setEditProductSuccess] = React.useState(false);

  // Delete product confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [deletingProduct, setDeletingProduct] = React.useState<Product | null>(null);
  const [deleteProductError, setDeleteProductError] = React.useState<string | null>(null);
  const [deleteProductSuccess, setDeleteProductSuccess] = React.useState(false);

  // Expanded row state
  const [expandedRows, setExpandedRows] = React.useState<string[]>([]);

  // Fetch products from backend
  const fetchAndSetProducts = React.useCallback(() => {
    setIsLoading(true);
    fetchAllProducts(currentPage, itemsPerPage)
      .then((result) => {
        // Map backend data to Product type if needed
        const mapped = Array.isArray(result.products)
          ? result.products.map((product: any) => ({
              id: product._id || product.id || '',
              name: product.name,
              category: product.category,
              additionalCategories: product.additionalCategories || [],
              pricePerBox: product.pricePerBox ?? product.price ?? 0,
              stock: product.stock ?? 0,
              status: product.status ?? 'active',
              rating: product.rating ?? product.averageRating ?? 0,
              reviewCount: product.reviewCount ?? 0,
              createdAt: product.createdAt ?? '',
              description: product.description ?? '',
              image: product.image ?? '',
            }))
          : [];
        setProducts(mapped);
        setTotalProducts(result.total || mapped.length);
        // Stats
        setActiveProducts(mapped.filter((p) => p.status === 'active').length);
        setAverageRating(
          mapped.length > 0
            ? mapped.reduce((sum, p) => sum + (typeof p.rating === 'number' ? p.rating : 0), 0) / mapped.length
            : 0
        );
        setTotalStock(mapped.reduce((sum, p) => sum + (typeof p.stock === 'number' ? p.stock : 0), 0));
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to fetch products");
      })
      .finally(() => setIsLoading(false));
  }, [currentPage]);

  React.useEffect(() => {
    fetchAndSetProducts();
  }, [fetchAndSetProducts]);

  // Filter and sort products
  let filteredProducts = products.filter((product) => {
    if (filter === "all") return true;
    if (product.status === filter) return true;
    if (
      typeof product.category === "string" &&
      product.category.toLowerCase().includes(filter.toLowerCase())
    )
      return true;
    if (
      typeof product.category === "object" &&
      product.category !== null &&
      "name" in product.category &&
      (product.category as any).name.toLowerCase().includes(filter.toLowerCase())
    )
      return true;
    return false;
  });

  filteredProducts = filteredProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      (typeof product.category === "string"
        ? product.category.toLowerCase().includes(search.toLowerCase())
        : typeof product.category === "object" && product.category !== null && "name" in product.category
        ? (product.category as any).name.toLowerCase().includes(search.toLowerCase())
        : false)
  );

  filteredProducts = filteredProducts.sort((a, b) => {
    if (sort === "date-desc")
      return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
    if (sort === "date-asc")
      return new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
    if (sort === "price-asc") return (a.pricePerBox ?? 0) - (b.pricePerBox ?? 0);
    if (sort === "price-desc") return (b.pricePerBox ?? 0) - (a.pricePerBox ?? 0);
    if (sort === "stock-asc") return (a.stock ?? 0) - (b.stock ?? 0);
    if (sort === "stock-desc") return (b.stock ?? 0) - (a.stock ?? 0);
    if (sort === "name-asc") return a.name.localeCompare(b.name);
    if (sort === "name-desc") return b.name.localeCompare(a.name);
    if (sort === "rating-asc") return (a.rating ?? 0) - (b.rating ?? 0);
    if (sort === "rating-desc") return (b.rating ?? 0) - (a.rating ?? 0);
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handlers
  const handleRowSelect = (productId: string, selected: boolean) => {
    if (selected) {
      setSelectedProducts((prev) => [...prev, productId]);
    } else {
      setSelectedProducts((prev) => prev.filter((id) => id !== productId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedProducts(paginatedProducts.map((product) => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleBulkAction = async (action: string, selectedIds: string[]) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log(`Bulk action ${action} for products:`, selectedIds);
      setSelectedProducts([]);
    } catch (error) {
      console.error("Error performing bulk action:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowEditProductModal(true);
    setEditProductError(null);
  };

  const handleEditProductFormSubmit = async (data: any) => {
    setEditProductError(null);
    try {
      if (!editingProduct) return;
      // If only status changed, use updateProductStatus
      const onlyStatusChanged =
        data.status !== editingProduct.status &&
        data.name === editingProduct.name &&
        data.price === (editingProduct.price ?? editingProduct.pricePerBox) &&
        data.stock === editingProduct.stock &&
        data.image === editingProduct.image &&
        data.description === editingProduct.description &&
        data.category === (typeof editingProduct.category === "object" && editingProduct.category !== null && "_id" in editingProduct.category ? (editingProduct.category as any)._id : editingProduct.category);
      if (onlyStatusChanged) {
        await updateProductStatus(editingProduct.id, data.status);
      } else {
        await updateProduct(editingProduct.id, data);
      }
      setShowEditProductModal(false);
      setEditProductSuccess(true);
      fetchAndSetProducts();
      setTimeout(() => setEditProductSuccess(false), 3500);
    } catch (err) {
      setEditProductError((err as Error).message || "Erreur lors de la mise à jour du produit.");
    }
  };

  const handleDelete = (product: Product) => {
    setDeletingProduct(product);
    setShowDeleteConfirm(true);
    setDeleteProductError(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setDeleteProductError(null);
    try {
      await deleteProduct(deletingProduct.id);
      setShowDeleteConfirm(false);
      setDeleteProductSuccess(true);
      fetchAndSetProducts();
      setTimeout(() => setDeleteProductSuccess(false), 3500);
    } catch (err) {
      setDeleteProductError((err as Error).message || "Erreur lors de la suppression du produit.");
    }
  };

  const handleToggleStatus = async () => {
    // TODO: Implement status toggle logic
  };

  const handleAddProduct = () => {
    setShowAddProductModal(true);
    setAddProductError(null);
  };

  const handleProductFormSubmit = async (data: any) => {
    setAddProductError(null);
    try {
      await createProduct(data);
      setShowAddProductModal(false);
      setAddProductSuccess(true);
      fetchAndSetProducts();
      setTimeout(() => setAddProductSuccess(false), 3500);
    } catch (err) {
      setAddProductError((err as Error).message || "Erreur lors de l'ajout du produit.");
    }
  };

  // Expanded row content for products
  const renderExpandedContent = (product: Product) => (
    <div>
      <ExpandedRowActions
        row={product as HasStatusAndId}
        resource={productsResource as any}
        onEdit={() => handleEdit(product)}
        onDelete={() => handleDelete(product)}
        loading={isLoading}
      />
    </div>
  );

  return (
    <>
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      {addProductSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded shadow-lg text-lg font-semibold animate-fade-in-out">
          ✅ Produit ajouté avec succès !
        </div>
      )}
      {editProductSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded shadow-lg text-lg font-semibold animate-fade-in-out">
          ✅ Produit mis à jour avec succès !
        </div>
      )}
      {deleteProductSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded shadow-lg text-lg font-semibold animate-fade-in-out">
          ✅ Produit supprimé avec succès !
        </div>
      )}
      <AdminPage
        resource={productsResource}
        data={paginatedProducts}
        selectedItems={selectedProducts}
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
          <ProductStats
            totalProducts={totalProducts}
            activeProducts={activeProducts}
            averageRating={averageRating}
            totalStock={totalStock}
          />
        }
        onAdd={handleAddProduct}
        renderExpandedContent={renderExpandedContent}
        expandedRows={expandedRows}
        onRowExpand={(id: string, expanded: boolean) => {
          setExpandedRows((prev) =>
            expanded ? [...prev, id] : prev.filter((rowId) => rowId !== id)
          );
        }}
      />
      {/* Add Product Modal */}
      <Modal
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        title="Ajouter un produit"
        size="md"
      >
        <ProductForm
          onCancel={() => setShowAddProductModal(false)}
          onSubmit={handleProductFormSubmit}
          isLoading={isLoading}
        />
        {addProductError && (
          <div style={{ color: 'red', marginTop: 8 }}>{addProductError}</div>
        )}
      </Modal>
      {/* Edit Product Modal */}
      <Modal
        isOpen={showEditProductModal}
        onClose={() => setShowEditProductModal(false)}
        title="Modifier le produit"
        size="md"
      >
        <ProductForm
          product={editingProduct || undefined}
          onCancel={() => setShowEditProductModal(false)}
          onSubmit={handleEditProductFormSubmit}
          isLoading={isLoading}
        />
        {editProductError && (
          <div style={{ color: 'red', marginTop: 8 }}>{editProductError}</div>
        )}
      </Modal>
      {/* Delete Product Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Supprimer le produit"
        size="sm"
      >
        <div className="mb-4">Êtes-vous sûr de vouloir supprimer ce produit&nbsp;? Cette action est irréversible.</div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(false)}
            className="px-6 py-2 rounded border"
          >Annuler</button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            className="px-6 py-2 rounded bg-red-600 text-white"
            disabled={isLoading}
          >Supprimer</button>
        </div>
        {deleteProductError && (
          <div style={{ color: 'red', marginTop: 8 }}>{deleteProductError}</div>
        )}
      </Modal>
    </>
  );
} 