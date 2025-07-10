import { User } from "@/config/adminResources";

export function filterUsers(users: User[], filter: string, search: string, sort: string): User[] {
  let filtered = users.filter((user) => {
    if (filter === "all") return true;
    if (filter === "actif") return user.status === "actif";
    if (filter === "inactif") return user.status === "inactif";
    if (filter === "admin") return user.role === "admin";
    if (filter === "store") return user.role === "store";
    if (filter === "delivery") return user.role === "delivery";
    return true;
  });

  filtered = filtered.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  filtered = filtered.sort((a, b) => {
    if (sort === "name-asc") return a.name.localeCompare(b.name);
    if (sort === "name-desc") return b.name.localeCompare(a.name);
    if (sort === "orders-asc") return (a.orderCount || 0) - (b.orderCount || 0);
    if (sort === "orders-desc") return (b.orderCount || 0) - (a.orderCount || 0);
    return 0;
  });

  return filtered;
} 