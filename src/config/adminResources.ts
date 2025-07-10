import React from "react";
import { AdminResource } from "../types/admin";
import { lightTheme, darkTheme } from "../theme/colors";
import { Category } from "@/types/admin";

// User type definition
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "store" | "delivery";
  status: "actif" | "inactif";
  orderCount: number;
  createdAt: string;
}

// Order type definition
export interface Order {
  id: string;
  orderNumber: string;
  clientName: string;
  clientEmail: string;
  status: "en attente" | "confirmée" | "expédiée" | "livrée" | "annulée";
  totalAmount: number;
  createdAt: string;
  deliveryDate: string;
  paymentStatus: "en attente" | "payé" | "échoué";
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
      label: "Activer",
      value: "activate",
      onClick: (selectedIds: string[]) => {
        console.log("Activer clients:", selectedIds);
      },
    },
    {
      label: "Désactiver",
      value: "deactivate",
      onClick: (selectedIds: string[]) => {
        console.log("Désactiver clients:", selectedIds);
      },
    },
    {
      label: "Supprimer",
      value: "delete",
      onClick: (selectedIds: string[]) => {
        console.log("Supprimer clients:", selectedIds);
      },
    },
  ],
  searchOptions: [
    { label: "Tous", value: "all" },
    { label: "Actif", value: "actif" },
    { label: "Inactif", value: "inactif" },
    { label: "Admin", value: "admin" },
    { label: "Magasin", value: "store" },
    { label: "Livreur", value: "delivery" },
  ],
  sortOptions: [
    { label: "Nom (A-Z)", value: "name-asc" },
    { label: "Nom (Z-A)", value: "name-desc" },
    { label: "Commandes (↑)", value: "orders-asc" },
    { label: "Commandes (↓)", value: "orders-desc" },
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
    { header: "Statut", accessor: "status" },
    { header: "Montant total", accessor: "totalAmount" },
    { header: "Paiement", accessor: "paymentStatus" },
    { header: "Date", accessor: "createdAt" },
    { header: "Livraison", accessor: "deliveryDate" },
  ],
  bulkActions: [
    {
      label: "Confirmer",
      value: "confirm",
      onClick: (selectedIds: string[]) => {
        console.log("Confirmer commandes:", selectedIds);
      },
    },
    {
      label: "Expédier",
      value: "ship",
      onClick: (selectedIds: string[]) => {
        console.log("Expédier commandes:", selectedIds);
      },
    },
    {
      label: "Annuler",
      value: "cancel",
      onClick: (selectedIds: string[]) => {
        console.log("Annuler commandes:", selectedIds);
      },
    },
    {
      label: "Supprimer",
      value: "delete",
      onClick: (selectedIds: string[]) => {
        console.log("Supprimer commandes:", selectedIds);
      },
    },
  ],
  searchOptions: [
    { label: "Toutes", value: "all" },
    { label: "En attente", value: "en attente" },
    { label: "Confirmée", value: "confirmée" },
    { label: "Expédiée", value: "expédiée" },
    { label: "Livrée", value: "livrée" },
    { label: "Annulée", value: "annulée" },
    { label: "Paiement en attente", value: "paiement_en_attente" },
    { label: "Paiement effectué", value: "paiement_payé" },
  ],
  sortOptions: [
    { label: "Date (récent)", value: "date-desc" },
    { label: "Date (ancien)", value: "date-asc" },
    { label: "Montant (↑)", value: "amount-asc" },
    { label: "Montant (↓)", value: "amount-desc" },
    { label: "N° Commande (A-Z)", value: "orderNumber-asc" },
    { label: "Client (A-Z)", value: "client-asc" },
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
      label: "Activer",
      value: "activate",
      onClick: (selectedIds: string[]) => {
        console.log("Activer produits:", selectedIds);
      },
    },
    {
      label: "Désactiver",
      value: "deactivate",
      onClick: (selectedIds: string[]) => {
        console.log("Désactiver produits:", selectedIds);
      },
    },
    {
      label: "Rupture de stock",
      value: "out_of_stock",
      onClick: (selectedIds: string[]) => {
        console.log("Rupture de stock produits:", selectedIds);
      },
    },
    {
      label: "Discontinuer",
      value: "discontinue",
      onClick: (selectedIds: string[]) => {
        console.log("Discontinuer produits:", selectedIds);
      },
    },
    {
      label: "Brouillon",
      value: "draft",
      onClick: (selectedIds: string[]) => {
        console.log("Brouillon produits:", selectedIds);
      },
    },
    {
      label: "Supprimer",
      value: "delete",
      onClick: (selectedIds: string[]) => {
        console.log("Supprimer produits:", selectedIds);
      },
    },
  ],
  searchOptions: [
    { label: "Tous", value: "all" },
    { label: "Eau", value: "Eau" },
    { label: "Jus", value: "Jus" },
    { label: "Mini cakes", value: "Mini cakes" },
    { label: "Chips", value: "Chips" },
    { label: "Epices", value: "Epices" },
    { label: "Chocolat", value: "Chocolat" },
    { label: "Actif", value: "active" },
    { label: "Inactif", value: "inactive" },
    { label: "Rupture de stock", value: "out_of_stock" },
    { label: "Discontinué", value: "discontinued" },
    { label: "Brouillon", value: "draft" },
  ],
  sortOptions: [
    { label: "Nom (A-Z)", value: "name-asc" },
    { label: "Nom (Z-A)", value: "name-desc" },
    { label: "Prix (↑)", value: "price-asc" },
    { label: "Prix (↓)", value: "price-desc" },
    { label: "Stock (↑)", value: "stock-asc" },
    { label: "Stock (↓)", value: "stock-desc" },
    { label: "Note (↑)", value: "rating-asc" },
    { label: "Note (↓)", value: "rating-desc" },
    { label: "Date (récent)", value: "date-desc" },
    { label: "Date (ancien)", value: "date-asc" },
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
      label: "Approuver",
      value: "approve",
      onClick: (selectedIds: string[]) => {
        console.log("Approuver avis:", selectedIds);
      },
    },
    {
      label: "Rejeter",
      value: "reject",
      onClick: (selectedIds: string[]) => {
        console.log("Rejeter avis:", selectedIds);
      },
    },
    {
      label: "Marquer comme vérifié",
      value: "verify",
      onClick: (selectedIds: string[]) => {
        console.log("Vérifier avis:", selectedIds);
      },
    },
    {
      label: "Supprimer",
      value: "delete",
      onClick: (selectedIds: string[]) => {
        console.log("Supprimer avis:", selectedIds);
      },
    },
  ],
  searchOptions: [
    { label: "Tous", value: "all" },
    { label: "En attente", value: "en attente" },
    { label: "Approuvé", value: "approuvé" },
    { label: "Rejeté", value: "rejeté" },
    { label: "Vérifié", value: "verified" },
    { label: "Non vérifié", value: "unverified" },
  ],
  sortOptions: [
    { label: "Date (récent)", value: "date-desc" },
    { label: "Date (ancien)", value: "date-asc" },
    { label: "Note (↑)", value: "rating-asc" },
    { label: "Note (↓)", value: "rating-desc" },
    { label: "Client (A-Z)", value: "client-asc" },
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
    { header: "Parent", accessor: "parentName" },
    { header: "Niveau", accessor: "level" },
    { header: "Sous-catégories", accessor: "subCategoryCount" },
    { header: "Créé le", accessor: "createdAt" },
  ],
  bulkActions: [
    {
      label: "Supprimer",
      value: "delete",
      onClick: (selectedIds: string[]) => {
        console.log("Supprimer catégories:", selectedIds);
      },
    },
  ],
  searchOptions: [
    { label: "Toutes", value: "all" },
    { label: "Niveau 1", value: "level-1" },
    { label: "Niveau 2", value: "level-2" },
    { label: "Niveau 3+", value: "level-3" },
  ],
  sortOptions: [
    { label: "Nom (A-Z)", value: "name-asc" },
    { label: "Nom (Z-A)", value: "name-desc" },
    { label: "Niveau (↑)", value: "level-asc" },
    { label: "Niveau (↓)", value: "level-desc" },
    { label: "Produits (↑)", value: "products-asc" },
    { label: "Produits (↓)", value: "products-desc" },
    { label: "Date (récent)", value: "date-desc" },
    { label: "Date (ancien)", value: "date-asc" },
  ],
  addButtonText: "Ajouter une catégorie",
  addButtonLink: "/admin/categories/add",
  deleteConfirmationText: (category: Category) => category.name,
};

