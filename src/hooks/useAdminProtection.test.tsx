import { renderHook } from '@testing-library/react';
import * as useAuthModule from './useAuth';
import { useAdminProtection } from './useAdminProtection';

jest.mock('next/router', () => ({ useRouter: () => ({}) }));

const baseAuth = {
  isAuthenticated: true,
  isLoading: false,
  error: '',
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  clearError: jest.fn(),
  setError: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
  updateUser: jest.fn(),
};

const baseUser = {
  id: '1',
  email: 'a@a.com',
  name: 'Admin',
  role: 'admin',
};

describe('useAdminProtection', () => {
  it('returns isAdmin true for admin user', () => {
    jest.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      ...baseAuth,
      user: { ...baseUser, role: 'admin' },
    });
    const { result } = renderHook(() => useAdminProtection());
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('returns error for non-admin user', () => {
    jest.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      ...baseAuth,
      user: { ...baseUser, role: 'store' },
    });
    const { result } = renderHook(() => useAdminProtection());
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.error).toMatch(/permissions/);
  });

  it('returns error if not authenticated', () => {
    jest.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      ...baseAuth,
      user: null,
      isAuthenticated: false,
    });
    const { result } = renderHook(() => useAdminProtection());
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.error).toMatch(/connect/);
  });
}); 