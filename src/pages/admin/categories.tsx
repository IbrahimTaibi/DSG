import React from "react";
import AdminPage from "@/components/admin/dashboard/AdminPage";
import { categoriesResource } from "@/config/adminResources";
import { fetchCategoryTree } from "@/services/categoryService";
import ExpandedRowActions from "@/components/admin/tables/ExpandedRowActions";
import CategoryForm from "@/components/forms/CategoryForm";
import { createCategory, updateCategory, deleteCategory } from "@/services/categoryService";
import { useDarkMode } from "@/contexts/DarkModeContext";
import Modal from "@/components/ui/Modal";

// Redesigned, theme-aware CategoryStats
const CategoryStats = ({ totalCategories, rootCategories, leafCategories }: any) => {
  const { currentTheme } = useDarkMode();
  const stats = [
    {
      label: "Total catégories",
      value: totalCategories,
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" />
          <rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" />
          <rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" />
          <rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      color: currentTheme.status.info,
    },
    {
      label: "Catégories racines",
      value: rootCategories,
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      color: currentTheme.status.success,
    },
    {
      label: "Catégories feuilles",
      value: leafCategories,
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      color: currentTheme.status.warning,
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="p-4 lg:p-6 rounded-xl border transition-all duration-200 hover:shadow-lg"
          style={{
            background: currentTheme.background.card,
            borderColor: currentTheme.border.primary,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: currentTheme.text.secondary }}>{stat.label}</p>
              <p className="text-2xl lg:text-3xl font-bold mt-2" style={{ color: currentTheme.text.primary }}>{stat.value}</p>
            </div>
            <div className="p-2 lg:p-3 rounded-lg" style={{ background: stat.color + "15", color: stat.color }}>{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function AdminCategories() {
  const [categories, setCategories] = React.useState<any[]>([]);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const [sort, setSort] = React.useState("name-asc");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const itemsPerPage = 10;
  const [showFormModal, setShowFormModal] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<any | null>(null);
  const [formLoading, setFormLoading] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [expandedRows, setExpandedRows] = React.useState<string[]>([]);

  React.useEffect(() => {
    setIsLoading(true);
    fetchCategoryTree()
      .then((data) => {
        // Flatten tree for table view, add parentName, level, subCategoryCount, and ensure unique id
        const flatten = (nodes: any[], parentName = "", level = 1): any[] =>
          nodes.flatMap((cat) => [
            {
              ...cat,
              id: cat.id || cat._id, // Ensure id is present and unique
              parentName: parentName || null,
              level,
              subCategoryCount: cat.children ? cat.children.length : 0,
            },
            ...(cat.children ? flatten(cat.children, cat.name, level + 1) : []),
          ]);
        setCategories(flatten(data));
        setError(null);
      })
      .catch(() => setError("Erreur lors du chargement des catégories"))
      .finally(() => setIsLoading(false));
  }, []);

  // Filter and sort
  let filteredCategories = categories.filter((cat) => {
    if (filter === "all") return true;
    if (filter === "root") return !cat.parentName;
    if (filter === "child") return !!cat.parentName;
    return true;
  });
  filteredCategories = filteredCategories.filter(
    (cat) => cat.name.toLowerCase().includes(search.toLowerCase()) ||
      (cat.slug && cat.slug.toLowerCase().includes(search.toLowerCase()))
  );
  filteredCategories = filteredCategories.sort((a, b) => {
    if (sort === "name-asc") return a.name.localeCompare(b.name);
    if (sort === "name-desc") return b.name.localeCompare(a.name);
    if (sort === "level-asc") return (a.level || 0) - (b.level || 0);
    if (sort === "level-desc") return (b.level || 0) - (a.level || 0);
    if (sort === "createdAt-asc") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sort === "createdAt-desc") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handleRowSelect = (categoryId: string, selected: boolean) => {
    setSelectedCategories((prev) => selected ? [...prev, categoryId] : prev.filter((id) => id !== categoryId));
  };
  const handleSelectAll = (selected: boolean) => {
    setSelectedCategories(selected ? paginatedCategories.map((cat) => cat.id) : []);
  };
  const handleAdd = () => {
    setEditingCategory(null);
    setShowFormModal(true);
  };
  const handleEdit = (cat: any) => {
    setEditingCategory(cat);
    setShowFormModal(true);
  };
  const handleFormSubmit = async (data: { name: string; parent?: string | null }) => {
    setFormLoading(true);
    setFormError(null);
    try {
      const cleanData = { ...data, parent: data.parent || undefined };
      if (editingCategory) {
        await updateCategory(editingCategory.id, cleanData);
      } else {
        await createCategory(cleanData);
      }
      // Refetch categories
      fetchCategoryTree().then((data) => {
        const flatten = (nodes: any[], parentName = "", level = 1): any[] =>
          nodes.flatMap((cat) => [
            {
              ...cat,
              id: cat.id || cat._id, // Ensure id is present and unique after update
              parentName: parentName || null,
              level,
              subCategoryCount: cat.children ? cat.children.length : 0,
            },
            ...(cat.children ? flatten(cat.children, cat.name, level + 1) : []),
          ]);
        setCategories(flatten(data));
        setExpandedRows([]); // Reset expanded rows after update
      });
      setShowFormModal(false);
    } catch (e: any) {
      setFormError(e.message || "Erreur lors de l'enregistrement");
    } finally {
      setFormLoading(false);
    }
  };
  const handleDelete = async (cat: any) => {
    setIsLoading(true);
    try {
      await deleteCategory(cat.id);
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
    } catch {
      setError("Erreur lors de la suppression");
    } finally {
      setIsLoading(false);
    }
  };
  const handleBulkAction = async (action: string, selectedIds: string[]) => {
    if (action === "delete") {
      setIsLoading(true);
      try {
        await Promise.all(selectedIds.map((id) => deleteCategory(id)));
        setCategories((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
        setSelectedCategories([]);
      } catch {
        setError("Erreur lors de la suppression en masse");
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleToggleStatus = () => {
    // Not used for categories
  };

  // Stats
  const totalCategories = categories.length;
  const rootCategories = categories.filter((cat) => !cat.parentName).length;
  const leafCategories = categories.filter((cat) => cat.subCategoryCount === 0).length;

  return (
    <>
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      <AdminPage
        resource={categoriesResource}
        data={paginatedCategories}
        selectedItems={selectedCategories}
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
        statsComponent={<CategoryStats totalCategories={totalCategories} rootCategories={rootCategories} leafCategories={leafCategories} />}
        renderExpandedContent={(category) => (
          <ExpandedRowActions
            row={category}
            resource={categoriesResource}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={isLoading}
          />
        )}
        expandedRows={expandedRows}
        onRowExpand={(id: string, expanded: boolean) => {
          setExpandedRows((prev) =>
            expanded ? [...prev, id] : prev.filter((rowId) => rowId !== id)
          );
        }}
        hideAddButton={false}
        onAdd={handleAdd}
      />
      {showFormModal && (
        <Modal
          isOpen={showFormModal}
          onClose={() => setShowFormModal(false)}
          title={editingCategory ? "Modifier la catégorie" : "Ajouter une catégorie"}
          size="md"
        >
          <CategoryForm
            category={editingCategory}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowFormModal(false)}
            isLoading={formLoading}
          />
          {formError && <div className="text-red-500 mt-2">{formError}</div>}
        </Modal>
      )}
    </>
  );
} 