import { filterUsers } from "./userFilter";
import { User } from "@/config/adminResources";

const users: User[] = [
  { id: "1", name: "Alice", email: "alice@example.com", role: "admin", status: "actif", orderCount: 5, createdAt: "" },
  { id: "2", name: "Bob", email: "bob@example.com", role: "store", status: "inactif", orderCount: 2, createdAt: "" },
  { id: "3", name: "Charlie", email: "charlie@example.com", role: "delivery", status: "actif", orderCount: 3, createdAt: "" },
];

describe("filterUsers", () => {
  it("filters by role 'admin'", () => {
    const result = filterUsers(users, "admin", "", "name-asc");
    expect(result).toHaveLength(1);
    expect(result[0].role).toBe("admin");
  });

  it("filters by role 'store'", () => {
    const result = filterUsers(users, "store", "", "name-asc");
    expect(result).toHaveLength(1);
    expect(result[0].role).toBe("store");
  });

  it("filters by status 'actif'", () => {
    const result = filterUsers(users, "actif", "", "name-asc");
    expect(result).toHaveLength(2);
    expect(result.every(u => u.status === "actif")).toBe(true);
  });

  it("searches by name", () => {
    const result = filterUsers(users, "all", "ali", "name-asc");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Alice");
  });

  it("sorts by orderCount descending", () => {
    const result = filterUsers(users, "all", "", "orders-desc");
    expect(result[0].orderCount).toBe(5);
    expect(result[1].orderCount).toBe(3);
    expect(result[2].orderCount).toBe(2);
  });
}); 