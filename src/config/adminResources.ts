import React from "react";
import { AdminResource } from "../types/admin";
import { lightTheme, darkTheme } from "../theme/colors";
import { Category } from "@/types/admin";

// User type definition
export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: "admin" | "store" | "delivery";
  status: "active" | "inactive" | "suspended" | "deleted";
  orderCount: number;
  createdAt: string;
}

// Order type definition
export interface Order {
  id: string;
  orderNumber: string;
  clientName: string;
  clientEmail: string;
  status: "en attente" | "confirmée" | "expédiée" | "livrée" | "annulée" | "pending" | "waiting_for_delivery" | "delivering" | "delivered" | "cancelled";
  totalAmount: number;
  createdAt: string;
  deliveryDate: string;
  paymentStatus: "en attente" | "payé" | "échoué";
  assignedToName?: string; // Added for the new column
  deleted?: boolean; // Optional, for soft delete support
  statusLabel?: string; // For display
}

// Product type definition
export interface Product {
  id: string;
  name: string;
  category: string;
  additionalCategories: string[];
  pricePerBox: number;
  stock: number;
  status: "active" | "inactive" | "out_of_stock" | "discontinued" | "draft";
  rating: number;
  reviewCount: number;
  createdAt: string;
}

// Review type definition
export interface Review {
  id: string;
  clientName: string;
  clientEmail: string;
  productName: string;
  rating: number;
  comment: string;
  status: "en attente" | "approuvé" | "rejeté";
  createdAt: string;
  isVerified: boolean;
}

// Users resource configuration
export const usersResource: AdminResource<User> = {
  name: "users",
  displayName: "utilisateurs",
  tableColumns: [
    { header: "Nom", accessor: "name" },
    { header: "Email", accessor: "email" },
    {
      header: "N° de téléphone",
      accessor: "mobile",
      render: (value) => {
        // Remove '+216' if present
        const phone = typeof value === 'string' ? value.replace(/^\+216\s?/, '') : value;
        return phone;
      },
    },
    {
      header: "Rôle",
      accessor: "role",
      render: (value) => {
        const mode = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const theme = mode === 'dark' ? darkTheme : lightTheme;
        let color, label;
        if (value === "admin") {
          color = theme.status.info;
          label = "Admin";
        } else if (value === "delivery") {
          color = theme.status.warning;
          label = "Livreur";
        } else if (value === "store") {
          color = theme.interactive.secondary;
          label = "Magasin";
        } else {
          color = theme.text.muted;
          label = value;
        }
        return React.createElement(
          'span',
          {
            style: {
              color,
              background: color + "15",
              border: `1px solid ${color}30`,
              padding: "2px 10px",
              borderRadius: "999px",
              fontSize: 12,
              fontWeight: 500,
              display: "inline-block",
            }
          },
          label
        );
      },
    },
    {
      header: "Statut",
      accessor: "status",
      render: (value) => {
        const mode = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const theme = mode === 'dark' ? darkTheme : lightTheme;
        let color, label;
        switch (value) {
          case "active":
          case "actif":
            color = theme.status.success;
            label = "Actif";
            break;
          case "inactive":
          case "inactif":
            color = theme.status.warning;
            label = "Inactif";
            break;
          case "suspended":
          case "suspendu":
            color = theme.status.error;
            label = "Suspendu";
            break;
          case "deleted":
          case "supprimé":
            color = theme.text.muted;
            label = "Supprimé";
            break;
          default:
            color = theme.text.muted;
            label = "Inconnu";
        }
        return React.createElement(
          'span',
          {
            style: {
              color,
              background: color + "15",
              border: `1px solid ${color}30`,
              padding: "2px 10px",
              borderRadius: "999px",
              fontSize: 12,
              fontWeight: 500,
              display: "inline-block",
            }
          },
          label
        );
      },
    },
    { header: "Commandes", accessor: "orderCount" },
    { header: "Créé le", accessor: "createdAt" },
  ],
  bulkActions: [
    {
      label: "Activer" as React.ReactNode,
      value: "activate",
      onClick: (selectedIds: string[]) => {
        console.log("Activer clients:", selectedIds);
      },
    },
    {
      label: "Désactiver" as React.ReactNode,
      value: "deactivate",
      onClick: (selectedIds: string[]) => {
        console.log("Désactiver clients:", selectedIds);
      },
    },
    {
      label: "Supprimer" as React.ReactNode,
      value: "delete",
      onClick: (selectedIds: string[]) => {
        console.log("Supprimer clients:", selectedIds);
      },
    },
  ],
  searchOptions: [
    { label: "Tous" as React.ReactNode, value: "all" },
    { label: "Actif" as React.ReactNode, value: "actif" },
    { label: "Inactif" as React.ReactNode, value: "inactif" },
    { label: "Admin" as React.ReactNode, value: "admin" },
    { label: "Magasin" as React.ReactNode, value: "store" },
    { label: "Livreur" as React.ReactNode, value: "delivery" },
  ],
  sortOptions: [
    { label: "Nom (A-Z)" as React.ReactNode, value: "name-asc" },
    { label: "Nom (Z-A)" as React.ReactNode, value: "name-desc" },
    { label: "Commandes (↑)" as React.ReactNode, value: "orders-asc" },
    { label: "Commandes (↓)" as React.ReactNode, value: "orders-desc" },
  ],
  addButtonText: "Ajouter un client",
  addButtonLink: "/admin/users/add",
  deleteConfirmationText: (user: User) => user.name,
};

// Orders resource configuration
export const ordersResource: AdminResource<Order> = {
  name: "orders",
  displayName: "commandes",
  tableColumns: [
    { header: "N° Commande", accessor: "orderNumber" },
    { header: "Client", accessor: "clientName" },
    {
      header: "Assigné à",
      accessor: "assignedToName",
      render: (value) => value || "-",
    },
    {
      header: "Statut",
      accessor: "status",
      render: (value, row: Order) => {
        const mode = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const theme = mode === 'dark' ? darkTheme : lightTheme;
        let color;
        switch (value) {
          case "pending":
            color = theme.status.warning;
            break;
          case "waiting_for_delivery":
            color = theme.status.info;
            break;
          case "delivering":
            color = theme.status.warning;
            break;
          case "delivered":
            color = theme.status.success;
            break;
          case "cancelled":
            color = theme.status.error;
            break;
          default:
            color = "#ff00ff"; // fallback magenta for debug
            console.warn("Unknown status value for color:", value);
        }
        console.log('Order status value:', value, 'Color:', color);
        const label = row.statusLabel || value;
        return React.createElement(
          'span',
          {
            style: {
              color,
              background: color + "15",
              border: `1px solid ${color}30`,
              padding: "2px 10px",
              borderRadius: "999px",
              fontSize: 12,
              fontWeight: 500,
              display: "inline-block",
            }
          },
          label
        );
      },
    },
    { header: "Montant total", accessor: "totalAmount" },
    { header: "Paiement", accessor: "paymentStatus" },
    { header: "Date", accessor: "createdAt" },
  ],
  bulkActions: [
    {
      label: "Confirmer" as React.ReactNode,
      value: "confirm",
      onClick: (selectedIds: string[]) => {
        console.log("Confirmer commandes:", selectedIds);
      },
    },
    {
      label: "Expédier" as React.ReactNode,
      value: "ship",
      onClick: (selectedIds: string[]) => {
        console.log("Expédier commandes:", selectedIds);
      },
    },
    {
      label: "Annuler" as React.ReactNode,
      value: "cancel",
      onClick: (selectedIds: string[]) => {
        console.log("Annuler commandes:", selectedIds);
      },
    },
    {
      label: "Supprimer" as React.ReactNode,
      value: "delete",
      onClick: (selectedIds: string[]) => {
        console.log("Supprimer commandes:", selectedIds);
      },
    },
  ],
  searchOptions: [
    { label: "Toutes" as React.ReactNode, value: "all" },
    { label: "En attente" as React.ReactNode, value: "en attente" },
    { label: "Confirmée" as React.ReactNode, value: "confirmée" },
    { label: "Expédiée" as React.ReactNode, value: "expédiée" },
    { label: "Livrée" as React.ReactNode, value: "livrée" },
    { label: "Annulée" as React.ReactNode, value: "annulée" },
    { label: "Paiement en attente" as React.ReactNode, value: "paiement_en_attente" },
    { label: "Paiement effectué" as React.ReactNode, value: "paiement_payé" },
  ],
  sortOptions: [
    { label: "Date (récent)" as React.ReactNode, value: "date-desc" },
    { label: "Date (ancien)" as React.ReactNode, value: "date-asc" },
    { label: "Montant (↑)" as React.ReactNode, value: "amount-asc" },
    { label: "Montant (↓)" as React.ReactNode, value: "amount-desc" },
    { label: "N° Commande (A-Z)" as React.ReactNode, value: "orderNumber-asc" },
    { label: "Client (A-Z)" as React.ReactNode, value: "client-asc" },
  ],
  addButtonText: "Nouvelle commande",
  addButtonLink: "/admin/orders/add",
  deleteConfirmationText: (order: Order) => `la commande ${order.orderNumber}`,
};

// Products resource configuration
export const productsResource: AdminResource<Product> = {
  name: "products",
  displayName: "produits",
  tableColumns: [
    { header: "Nom", accessor: "name" },
    { header: "Catégories", accessor: "category" },
    { header: "Prix/Colis (€)", accessor: "pricePerBox" },
    { header: "Stock", accessor: "stock" },
    { header: "Statut", accessor: "status" },
    { header: "Note", accessor: "rating" },
    { header: "Avis", accessor: "reviewCount" },
    { header: "Ajouté le", accessor: "createdAt" },
  ],
  bulkActions: [
    {
      label: "Activer" as React.ReactNode,
      value: "activate",
      onClick: (selectedIds: string[]) => {
        console.log("Activer produits:", selectedIds);
      },
    },
    {
      label: "Désactiver" as React.ReactNode,
      value: "deactivate",
      onClick: (selectedIds: string[]) => {
        console.log("Désactiver produits:", selectedIds);
      },
    },
    {
      label: "Rupture de stock" as React.ReactNode,
      value: "out_of_stock",
      onClick: (selectedIds: string[]) => {
        console.log("Rupture de stock produits:", selectedIds);
      },
    },
    {
      label: "Discontinuer" as React.ReactNode,
      value: "discontinue",
      onClick: (selectedIds: string[]) => {
        console.log("Discontinuer produits:", selectedIds);
      },
    },
    {
      label: "Brouillon" as React.ReactNode,
      value: "draft",
      onClick: (selectedIds: string[]) => {
        console.log("Brouillon produits:", selectedIds);
      },
    },
    {
      label: "Supprimer" as React.ReactNode,
      value: "delete",
      onClick: (selectedIds: string[]) => {
        console.log("Supprimer produits:", selectedIds);
      },
    },
  ],
  searchOptions: [
    { label: "Tous" as React.ReactNode, value: "all" },
    { label: "Eau" as React.ReactNode, value: "Eau" },
    { label: "Jus" as React.ReactNode, value: "Jus" },
    { label: "Mini cakes" as React.ReactNode, value: "Mini cakes" },
    { label: "Chips" as React.ReactNode, value: "Chips" },
    { label: "Epices" as React.ReactNode, value: "Epices" },
    { label: "Chocolat" as React.ReactNode, value: "Chocolat" },
    { label: "Actif" as React.ReactNode, value: "active" },
    { label: "Inactif" as React.ReactNode, value: "inactive" },
    { label: "Rupture de stock" as React.ReactNode, value: "out_of_stock" },
    { label: "Discontinué" as React.ReactNode, value: "discontinued" },
    { label: "Brouillon" as React.ReactNode, value: "draft" },
  ],
  sortOptions: [
    { label: "Nom (A-Z)" as React.ReactNode, value: "name-asc" },
    { label: "Nom (Z-A)" as React.ReactNode, value: "name-desc" },
    { label: "Prix (↑)" as React.ReactNode, value: "price-asc" },
    { label: "Prix (↓)" as React.ReactNode, value: "price-desc" },
    { label: "Stock (↑)" as React.ReactNode, value: "stock-asc" },
    { label: "Stock (↓)" as React.ReactNode, value: "stock-desc" },
    { label: "Note (↑)" as React.ReactNode, value: "rating-asc" },
    { label: "Note (↓)" as React.ReactNode, value: "rating-desc" },
    { label: "Date (récent)" as React.ReactNode, value: "date-desc" },
    { label: "Date (ancien)" as React.ReactNode, value: "date-asc" },
  ],
  addButtonText: "Ajouter un produit",
  addButtonLink: "/admin/products/add",
  deleteConfirmationText: (product: Product) => product.name,
};

// Reviews resource configuration
export const reviewsResource: AdminResource<Review> = {
  name: "reviews",
  displayName: "avis",
  tableColumns: [
    { header: "Client", accessor: "clientName" },
    { header: "Produit", accessor: "productName" },
    { header: "Note", accessor: "rating" },
    { header: "Statut", accessor: "status" },
    { header: "Vérifié", accessor: "isVerified" },
    { header: "Date", accessor: "createdAt" },
  ],
  bulkActions: [
    {
      label: "Approuver" as React.ReactNode,
      value: "approve",
      onClick: (selectedIds: string[]) => {
        console.log("Approuver avis:", selectedIds);
      },
    },
    {
      label: "Rejeter" as React.ReactNode,
      value: "reject",
      onClick: (selectedIds: string[]) => {
        console.log("Rejeter avis:", selectedIds);
      },
    },
    {
      label: "Marquer comme vérifié" as React.ReactNode,
      value: "verify",
      onClick: (selectedIds: string[]) => {
        console.log("Vérifier avis:", selectedIds);
      },
    },
    {
      label: "Supprimer" as React.ReactNode,
      value: "delete",
      onClick: (selectedIds: string[]) => {
        console.log("Supprimer avis:", selectedIds);
      },
    },
  ],
  searchOptions: [
    { label: "Tous" as React.ReactNode, value: "all" },
    { label: "En attente" as React.ReactNode, value: "en attente" },
    { label: "Approuvé" as React.ReactNode, value: "approuvé" },
    { label: "Rejeté" as React.ReactNode, value: "rejeté" },
    { label: "Vérifié" as React.ReactNode, value: "verified" },
    { label: "Non vérifié" as React.ReactNode, value: "unverified" },
  ],
  sortOptions: [
    { label: "Date (récent)" as React.ReactNode, value: "date-desc" },
    { label: "Date (ancien)" as React.ReactNode, value: "date-asc" },
    { label: "Note (↑)" as React.ReactNode, value: "rating-asc" },
    { label: "Note (↓)" as React.ReactNode, value: "rating-desc" },
    { label: "Client (A-Z)" as React.ReactNode, value: "client-asc" },
  ],
  addButtonText: "Nouvel avis",
  addButtonLink: "/admin/reviews/add",
  deleteConfirmationText: (review: Review) => `l'avis de ${review.clientName}`,
};
// Categories resource configuration
export const categoriesResource: AdminResource<Category> = {
  name: "categories",
  displayName: "catégories",
  tableColumns: [
    { header: "Nom", accessor: "name" },
    { header: "Slug", accessor: "slug" },
    {
      header: "Parent",
      accessor: "parentName",
      render: (value) => !value ? 'Racine' : value,
    },
    { header: "Niveau", accessor: "level" },
    { header: "Sous-catégories", accessor: "subCategoryCount" },
    {
      header: "Produits",
      accessor: "productCount",
      render: (value) => (value == null ? 0 : value),
    },
    { header: "Créé le", accessor: "createdAt" },
  ],
  bulkActions: [
    {
      label: "Supprimer" as React.ReactNode,
      value: "delete",
      onClick: (selectedIds: string[]) => {
        console.log("Supprimer catégories:", selectedIds);
      },
    },
  ],
  searchOptions: [
    { label: "Toutes" as React.ReactNode, value: "all" },
    { label: "Sans parent" as React.ReactNode, value: "root" },
    { label: "Avec parent" as React.ReactNode, value: "child" },
  ],
  sortOptions: [
    { label: "Nom (A-Z)" as React.ReactNode, value: "name-asc" },
    { label: "Nom (Z-A)" as React.ReactNode, value: "name-desc" },
    { label: "Niveau (croissant)" as React.ReactNode, value: "level-asc" },
    { label: "Niveau (décroissant)" as React.ReactNode, value: "level-desc" },
    { label: "Date de création (récent)" as React.ReactNode, value: "createdAt-desc" },
    { label: "Date de création (ancien)" as React.ReactNode, value: "createdAt-asc" },
  ],
  addButtonText: "Ajouter une catégorie",
  addButtonLink: "/admin/categories/add",
  deleteConfirmationText: (item) => `Supprimer la catégorie "${item.name}" ?`,
};

