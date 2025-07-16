import React from "react";
import { useRouter } from "next/router";
import AdminPage from "@/components/admin/dashboard/AdminPage";
import ReviewStats from "@/components/admin/stats/ReviewStats";
import { reviewsResource, Review } from "@/config/adminResources";

// Mock data (replace with real API calls)
const mockReviews: Review[] = [
  {
    id: "1",
    clientName: "Alice Martin",
    clientEmail: "alice@email.com",
    productName: "Plomberie d'urgence",
    rating: 5,
    comment:
      "Service exceptionnel, intervention rapide et professionnelle. Je recommande vivement !",
    status: "approuvé",
    createdAt: "2024-01-15",
    isVerified: true,
  },
  {
    id: "2",
    clientName: "Bob Dupont",
    clientEmail: "bob@email.com",
    productName: "Cours de mathématiques",
    rating: 4,
    comment:
      "Très bon professeur, explications claires. Mon fils a fait de gros progrès.",
    status: "approuvé",
    createdAt: "2024-01-16",
    isVerified: true,
  },
  {
    id: "3",
    clientName: "Charlie Durand",
    clientEmail: "charlie@email.com",
    productName: "Nettoyage de maison",
    rating: 3,
    comment: "Service correct mais un peu cher pour ce qui a été fait.",
    status: "en attente",
    createdAt: "2024-01-17",
    isVerified: false,
  },
  {
    id: "4",
    clientName: "Diane Leroy",
    clientEmail: "diane@email.com",
    productName: "Réparation électrique",
    rating: 5,
    comment:
      "Électricien très compétent et ponctuel. Travail soigné et propre.",
    status: "approuvé",
    createdAt: "2024-01-14",
    isVerified: true,
  },
  {
    id: "5",
    clientName: "Eve Moreau",
    clientEmail: "eve@email.com",
    productName: "Cours de piano",
    rating: 2,
    comment: "Cours annulé au dernier moment sans préavis. Très décevant.",
    status: "rejeté",
    createdAt: "2024-01-13",
    isVerified: false,
  },
  {
    id: "6",
    clientName: "Frank Dubois",
    clientEmail: "frank@email.com",
    productName: "Jardinage et entretien",
    rating: 4,
    comment: "Jardinier professionnel, travail bien fait. Prix raisonnable.",
    status: "approuvé",
    createdAt: "2024-01-18",
    isVerified: true,
  },
  {
    id: "7",
    clientName: "Grace Petit",
    clientEmail: "grace@email.com",
    productName: "Peinture intérieure",
    rating: 5,
    comment: "Peintre très talentueux, résultat magnifique. Je recommande !",
    status: "approuvé",
    createdAt: "2024-01-12",
    isVerified: true,
  },
  {
    id: "8",
    clientName: "Henri Rousseau",
    clientEmail: "henri@email.com",
    productName: "Cours de français",
    rating: 4,
    comment: "Professeur patient et pédagogue. Cours adaptés à mon niveau.",
    status: "en attente",
    createdAt: "2024-01-19",
    isVerified: false,
  },
  {
    id: "9",
    clientName: "Iris Blanc",
    clientEmail: "iris@email.com",
    productName: "Dépannage informatique",
    rating: 3,
    comment:
      "Service correct mais un peu lent. Prix élevé pour le temps passé.",
    status: "approuvé",
    createdAt: "2024-01-14",
    isVerified: true,
  },
  {
    id: "10",
    clientName: "Jacques Noir",
    clientEmail: "jacques@email.com",
    productName: "Cours de cuisine",
    rating: 5,
    comment:
      "Chef exceptionnel, j'ai appris énormément. Expérience inoubliable !",
    status: "approuvé",
    createdAt: "2024-01-07",
    isVerified: true,
  },
  {
    id: "11",
    clientName: "Karine Rouge",
    clientEmail: "karine@email.com",
    productName: "Ménage de fin de chantier",
    rating: 1,
    comment:
      "Service catastrophique, rien n'a été fait correctement. À éviter !",
    status: "rejeté",
    createdAt: "2024-01-16",
    isVerified: false,
  },
  {
    id: "12",
    clientName: "Louis Vert",
    clientEmail: "louis@email.com",
    productName: "Élagage d'arbres",
    rating: 4,
    comment: "Travail professionnel et sécurisé. Équipe compétente.",
    status: "approuvé",
    createdAt: "2024-01-09",
    isVerified: true,
  },
];

export default function AdminReviews() {
  const router = useRouter();

  // State management
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const [sort, setSort] = React.useState("date-desc");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedReviews, setSelectedReviews] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const itemsPerPage = 10;

  // Filter and sort reviews
  let filteredReviews = mockReviews.filter((review) => {
    if (filter === "all") return true;
    if (filter === "en attente") return review.status === "en attente";
    if (filter === "approuvé") return review.status === "approuvé";
    if (filter === "rejeté") return review.status === "rejeté";
    if (filter === "verified") return review.isVerified;
    if (filter === "unverified") return !review.isVerified;
    return true;
  });

  filteredReviews = filteredReviews.filter(
    (review) =>
      review.clientName.toLowerCase().includes(search.toLowerCase()) ||
      review.clientEmail.toLowerCase().includes(search.toLowerCase()) ||
      review.productName.toLowerCase().includes(search.toLowerCase()) ||
      review.comment.toLowerCase().includes(search.toLowerCase()),
  );

  filteredReviews = filteredReviews.sort((a, b) => {
    if (sort === "date-desc")
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sort === "date-asc")
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sort === "rating-asc") return a.rating - b.rating;
    if (sort === "rating-desc") return b.rating - a.rating;
    if (sort === "client-asc") return a.clientName.localeCompare(b.clientName);
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReviews = filteredReviews.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Handlers
  const handleRowSelect = (reviewId: string, selected: boolean) => {
    if (selected) {
      setSelectedReviews((prev) => [...prev, reviewId]);
    } else {
      setSelectedReviews((prev) => prev.filter((id) => id !== reviewId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedReviews(paginatedReviews.map((review) => review.id));
    } else {
      setSelectedReviews([]);
    }
  };

  const handleBulkAction = async (action: string, selectedIds: string[]) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log(`Bulk action ${action} for reviews:`, selectedIds);
      setSelectedReviews([]);
    } catch (error) {
      console.error("Error performing bulk action:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (review: Review) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log(`Delete review ${review.id}`);
    } catch (error) {
      console.error("Error deleting review:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (review: Review) => {
    router.push(`/admin/reviews/${review.id}/edit`);
  };

  const handleToggleStatus = async (review: Review) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log(`Toggle status for review ${review.id}`);
    } catch (error) {
      console.error("Error toggling review status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate stats for ReviewStats component
  const totalReviews = mockReviews.length;
  const pendingReviews = mockReviews.filter(
    (review) => review.status === "en attente",
  ).length;
  const averageRating =
    mockReviews.length > 0
      ? mockReviews.reduce((sum, review) => sum + review.rating, 0) /
        mockReviews.length
      : 0;
  const verifiedReviews = mockReviews.filter(
    (review) => review.isVerified,
  ).length;

  return (
    <AdminPage
      resource={reviewsResource}
      data={paginatedReviews}
      selectedItems={selectedReviews}
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
        <ReviewStats
          totalReviews={totalReviews}
          pendingReviews={pendingReviews}
          averageRating={averageRating}
          verifiedReviews={verifiedReviews}
        />
      }
    />
  );
}
