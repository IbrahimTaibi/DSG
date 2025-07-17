import React, { useState, useEffect } from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCategories } from "@/hooks/useCategories";

interface CategoryFormProps {
  category?: any;
  onSubmit: (data: { name: string; parent?: string | null }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSubmit, onCancel, isLoading = false }) => {
  const { currentTheme } = useDarkMode();
  const { categoryTree, loading } = useCategories();
  const [name, setName] = useState(category?.name || "");
  const [parent, setParent] = useState<string | null>(category?.parent || null);

  useEffect(() => {
    setName(category?.name || "");
    setParent(category?.parent || null);
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), parent: parent || null });
  };

  // Recursive dropdown for parent selection
  const renderOptions = (nodes: any[], level = 0): React.ReactNode[] =>
    nodes.flatMap((cat) => [
      <option key={cat._id} value={cat._id}>
        {"- ".repeat(level) + cat.name}
      </option>,
      ...(cat.children ? renderOptions(cat.children, level + 1) : []),
    ]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text.primary }}>
          Nom de la catégorie *
        </label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Entrez le nom de la catégorie"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text.primary }}>
          Catégorie parente
        </label>
        <select
          value={parent || ""}
          onChange={(e) => setParent(e.target.value || null)}
          className="w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-opacity-50"
          style={{
            background: currentTheme.background.primary,
            color: currentTheme.text.primary,
            borderColor: currentTheme.border.primary,
            border: `1px solid ${currentTheme.border.primary}`,
          }}
        >
          <option value="">Aucune (racine)</option>
          {!loading && renderOptions(categoryTree)}
        </select>
      </div>
      <div className="flex justify-end gap-3 pt-6 border-t" style={{ borderColor: currentTheme.border.primary }}>
        <Button type="button" onClick={onCancel} className="px-6 py-2" style={{ color: currentTheme.text.secondary, background: "transparent", border: `1px solid ${currentTheme.border.primary}` }}>Annuler</Button>
        <Button type="submit" disabled={isLoading} className="px-6 py-2">
          {category ? "Enregistrer" : "Ajouter"}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm; 