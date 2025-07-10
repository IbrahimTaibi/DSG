import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { DarkModeProvider } from '@/contexts/DarkModeContext';
import { useDarkMode } from './useDarkMode';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

describe('useDarkMode', () => {
  it('provides darkMode value and toggles', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <DarkModeProvider>{children}</DarkModeProvider>
    );
    const { result } = renderHook(() => useDarkMode(), { wrapper });
    const initial = result.current.darkMode;
    act(() => {
      result.current.toggleDarkMode();
    });
    expect(result.current.darkMode).toBe(!initial);
  });
}); 