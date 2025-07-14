import { renderHook, waitFor, act } from '@testing-library/react';
import { useCategories } from './useCategories';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Helper to reset the module-level cache in useCategories
async function resetCategoryCache() {
  const useCategoriesModule = await import('./useCategories');
  // @ts-expect-error: test needs access to private cache
  useCategoriesModule.categoriesCache = null;
  // @ts-expect-error: test needs access to private cache
  useCategoriesModule.categoryTreeCache = null;
  // @ts-expect-error: test needs access to private cache
  useCategoriesModule.cacheTimestamp = 0;
}

describe('useCategories', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    resetCategoryCache();
  });

  it('should fetch categories successfully', async () => {
    const mockCategories = [
      { _id: '1', name: 'Fresh Produce', slug: 'fresh-produce', parent: null },
      { _id: '2', name: 'Dairy & Eggs', slug: 'dairy-eggs', parent: null },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategories,
    });

    const { result } = renderHook(() => useCategories());

    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.categories).toEqual([]);

    // Wait for the fetch to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.categories).toEqual(mockCategories);
    // categoryTree should have 'children' property
    expect(result.current.categoryTree).toEqual([
      { ...mockCategories[0], children: [] },
      { ...mockCategories[1], children: [] },
    ]);
    expect(result.current.error).toBe(null);
  });

  it('should handle fetch errors gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.categories).toEqual([]);
  });

  it('should handle HTTP error responses', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('HTTP error! status: 500');
    expect(result.current.categories).toEqual([]);
  });

  it('should build tree structure correctly for nested categories', async () => {
    const mockCategories = [
      { _id: '1', name: 'Electronics', slug: 'electronics', parent: null },
      { _id: '2', name: 'Computers', slug: 'computers', parent: '1' },
      { _id: '3', name: 'Laptops', slug: 'laptops', parent: '2' },
      { _id: '4', name: 'Food', slug: 'food', parent: null },
      { _id: '5', name: 'Fruits', slug: 'fruits', parent: '4' },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategories,
    });

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Check flat categories (only root categories for navbar)
    expect(result.current.categories).toEqual([
      { _id: '1', name: 'Electronics', slug: 'electronics', parent: null },
      { _id: '4', name: 'Food', slug: 'food', parent: null },
    ]);

    // Check tree structure
    expect(result.current.categoryTree).toEqual([
      {
        _id: '1',
        name: 'Electronics',
        slug: 'electronics',
        parent: null,
        children: [
          {
            _id: '2',
            name: 'Computers',
            slug: 'computers',
            parent: '1',
            children: [
              {
                _id: '3',
                name: 'Laptops',
                slug: 'laptops',
                parent: '2',
                children: [],
              },
            ],
          },
        ],
      },
      {
        _id: '4',
        name: 'Food',
        slug: 'food',
        parent: null,
        children: [
          {
            _id: '5',
            name: 'Fruits',
            slug: 'fruits',
            parent: '4',
            children: [],
          },
        ],
      },
    ]);
  });

  it('should handle orphaned categories gracefully', async () => {
    const mockCategories = [
      { _id: '1', name: 'Electronics', slug: 'electronics', parent: null },
      { _id: '2', name: 'Computers', slug: 'computers', parent: '1' },
      { _id: '3', name: 'Orphaned', slug: 'orphaned', parent: '999' }, // Non-existent parent
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategories,
    });

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Orphaned category should be ignored in tree building
    expect(result.current.categories).toEqual([
      { _id: '1', name: 'Electronics', slug: 'electronics', parent: null },
    ]);

    expect(result.current.categoryTree).toEqual([
      {
        _id: '1',
        name: 'Electronics',
        slug: 'electronics',
        parent: null,
        children: [
          {
            _id: '2',
            name: 'Computers',
            slug: 'computers',
            parent: '1',
            children: [],
          },
        ],
      },
    ]);
  });

  it('should handle empty categories array', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.categories).toEqual([]);
    expect(result.current.categoryTree).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('should handle categories with null parent as string', async () => {
    const mockCategories = [
      { _id: '1', name: 'Electronics', slug: 'electronics', parent: 'null' }, // String 'null'
      { _id: '2', name: 'Food', slug: 'food', parent: null }, // Actual null
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategories,
    });

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Only actual null parents should be considered root categories
    expect(result.current.categories).toEqual([
      { _id: '2', name: 'Food', slug: 'food', parent: null },
    ]);

    expect(result.current.categoryTree).toEqual([
      {
        _id: '2',
        name: 'Food',
        slug: 'food',
        parent: null,
        children: [],
      },
    ]);
  });

  it('should call the correct API endpoint', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    renderHook(() => useCategories());

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/categories')
      );
    });
  });

  it('should provide refetch function', async () => {
    const mockCategories = [
      { _id: '1', name: 'Test', slug: 'test', parent: null },
    ];

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockCategories,
    });

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(typeof result.current.refetch).toBe('function');

    // Test refetch
    await act(async () => {
      await result.current.refetch();
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should handle malformed category data gracefully', async () => {
    const mockCategories = [
      { _id: '1', name: 'Valid', slug: 'valid', parent: null },
      { _id: '2', name: 'Invalid', parent: null }, // Missing slug
      { _id: '3', slug: 'no-name', parent: null }, // Missing name
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategories,
    });

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should still work with partial data
    expect(result.current.categories).toEqual([
      { _id: '1', name: 'Valid', slug: 'valid', parent: null },
      { _id: '2', name: 'Invalid', parent: null },
      { _id: '3', slug: 'no-name', parent: null },
    ]);
  });
}); 