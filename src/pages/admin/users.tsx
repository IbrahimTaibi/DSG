import React from "react";
import { useRouter } from "next/router";
import AdminPage from "@/components/admin/AdminPage";
import UserStats from "@/components/admin/UserStats";
import { usersResource, User } from "@/config/adminResources";
import { fetchUsersWithOrderCount, deleteUser, updateUser } from "@/services/userService";
import StatusChangeModal from "@/components/ui/StatusChangeModal";

export default function AdminUsers() {
  const router = useRouter();

  // State management
  const [users, setUsers] = React.useState<User[]>([]);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const [sort, setSort] = React.useState("name-asc");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [statusModalOpen, setStatusModalOpen] = React.useState(false);
  const [statusUser, setStatusUser] = React.useState<User | null>(null);
  const [selectedStatus, setSelectedStatus] = React.useState<string>("");

  const itemsPerPage = 10;

  // Fetch users from backend
  React.useEffect(() => {
    setIsLoading(true);
    fetchUsersWithOrderCount()
      .then((data) => {
        setUsers(data);
        setError(null);
      })
      .catch(() => {
        setError("Failed to fetch users");
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Filter and sort users
  let filteredUsers = users.filter((user) => {
    if (filter === "all") return true;
    if (filter === "actif") return user.status === "actif";
    if (filter === "inactif") return user.status === "inactif";
    if (filter === "admin") return user.role === "admin";
    if (filter === "store") return user.role === "store";
    if (filter === "delivery") return user.role === "delivery";
    return true;
  });

  filteredUsers = filteredUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()),
  );

  filteredUsers = filteredUsers.sort((a, b) => {
    if (sort === "name-asc") return a.name.localeCompare(b.name);
    if (sort === "name-desc") return b.name.localeCompare(a.name);
    if (sort === "orders-asc") return (a.orderCount || 0) - (b.orderCount || 0);
    if (sort === "orders-desc") return (b.orderCount || 0) - (a.orderCount || 0);
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Handlers
  const handleRowSelect = (userId: string, selected: boolean) => {
    if (selected) {
      setSelectedUsers((prev) => [...prev, userId]);
    } else {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedUsers(paginatedUsers.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleBulkAction = async (action: string, selectedIds: string[]) => {
    setIsLoading(true);
    try {
      if (action === "delete") {
        await Promise.all(selectedIds.map((id) => deleteUser(id)));
        setUsers((prev) => prev.filter((u) => !selectedIds.includes(u.id)));
      }
      setSelectedUsers([]);
    } catch {
      setError("Error performing bulk action");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (user: User) => {
    setIsLoading(true);
    try {
      await deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch {
      setError("Error deleting user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    router.push(`/admin/users/${user.id}/edit`);
  };

  const handleToggleStatus = (user: User) => {
    setStatusUser(user);
    setSelectedStatus(user.status);
    setStatusModalOpen(true);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };

  const handleStatusConfirm = async () => {
    if (!statusUser) return;
    setIsLoading(true);
    try {
      await updateUser(statusUser.id, { status: selectedStatus });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === statusUser.id ? { ...u, status: selectedStatus as User["status"] } : u
        )
      );
      setStatusModalOpen(false);
      setStatusUser(null);
    } catch {
      setError("Erreur lors du changement de statut");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate stats for UserStats component
  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.status === "actif").length;
  const inactiveUsers = users.filter((user) => user.status === "inactif").length;

  return (
    <>
      {error && (
        <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>
      )}
      <AdminPage
        resource={usersResource}
        data={paginatedUsers}
        selectedItems={selectedUsers}
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
          <UserStats
            totalUsers={totalUsers}
            activeUsers={activeUsers}
            inactiveUsers={inactiveUsers}
          />
        }
      />
      <StatusChangeModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        currentStatus={statusUser?.status || "active"}
        selectedStatus={selectedStatus}
        options={[
          { label: "Actif", value: "active" },
          { label: "Inactif", value: "inactive" },
          { label: "Suspendu", value: "suspended" },
          { label: "Supprimé", value: "deleted" },
        ]}
        onChange={handleStatusChange}
        onConfirm={handleStatusConfirm}
        loading={isLoading}
        title="Changer le statut de l'utilisateur"
      />
    </>
  );
}
