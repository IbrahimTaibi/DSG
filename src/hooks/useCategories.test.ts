import { renderHook, waitFor } from '@testing-library/react';
import { useCategories } from './useCategories';

// Mock fetch globally
global.fetch = jest.fn();

describe('useCategories', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch categories successfully', async () => {
    const mockCategories = [
      { _id: '1', name: 'Fresh Produce', slug: 'fresh-produce', parent: null },
      { _id: '2', name: 'Dairy & Eggs', slug: 'dairy-eggs', parent: null },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
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
    expect(result.current.categoryTree).toEqual(mockCategories);
    expect(result.current.error).toBe(null);
  });

  it('should handle fetch errors gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.categories).toEqual([]);
  });

  it('should use cache when available', async () => {
    const mockCategories = [
      { _id: '1', name: 'Fresh Produce', slug: 'fresh-produce', parent: null },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategories,
    });

    const { result: firstResult } = renderHook(() => useCategories());
    
    await waitFor(() => {
      expect(firstResult.current.loading).toBe(false);
    });

    // Second call should use cache
    const { result: secondResult } = renderHook(() => useCategories());
    
    expect(secondResult.current.loading).toBe(false);
    expect(secondResult.current.categories).toEqual(mockCategories);
    expect(secondResult.current.categoryTree).toEqual(mockCategories);
    
    // Fetch should only be called once due to caching
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('should build tree structure correctly', async () => {
    const mockCategories = [
      { _id: '1', name: 'Electronics', slug: 'electronics', parent: null },
      { _id: '2', name: 'Computers', slug: 'computers', parent: '1' },
      { _id: '3', name: 'Laptops', slug: 'laptops', parent: '2' },
      { _id: '4', name: 'Food', slug: 'food', parent: null },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategories,
    });

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.categories).toEqual(mockCategories);
    expect(result.current.categoryTree).toHaveLength(2); // Electronics and Food
    expect(result.current.categoryTree[0].name).toBe('Electronics');
    expect(result.current.categoryTree[0].children).toHaveLength(1); // Computers
    expect(result.current.categoryTree[0].children[0].name).toBe('Computers');
    expect(result.current.categoryTree[0].children[0].children).toHaveLength(1); // Laptops
    expect(result.current.categoryTree[0].children[0].children[0].name).toBe('Laptops');
    expect(result.current.categoryTree[1].name).toBe('Food');
    expect(result.current.categoryTree[1].children).toHaveLength(0);
  });
}); 