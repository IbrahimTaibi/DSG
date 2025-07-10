import { fetchUsersWithOrderCount } from "./userService";

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([{ id: "1", name: "Test User", orderCount: 2 }]),
  })
) as jest.Mock;

describe("fetchUsersWithOrderCount", () => {
  it("returns users with order count", async () => {
    const users = await fetchUsersWithOrderCount();
    expect(users).toEqual([{ id: "1", name: "Test User", orderCount: 2 }]);
  });

  it("throws on fetch error", async () => {
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ ok: false })
    );
    await expect(fetchUsersWithOrderCount()).rejects.toThrow("Failed to fetch users with order count");
  });
}); 