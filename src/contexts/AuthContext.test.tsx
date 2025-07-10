import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { AuthProvider, AuthContext, AuthContextType } from './AuthContext';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AuthProvider integration', () => {
  it('logs in and updates context', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { token: 'abc', user: { id: '1', name: 'Test', email: 'a@a.com', role: 'admin' } }
    });

    let contextValue: AuthContextType;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {value => {
            contextValue = value!;
            return <button onClick={() => value!.login('123', 'pw')}>Login</button>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Login'));
    await waitFor(() => expect(contextValue.user).toBeTruthy());
    expect(contextValue.user?.name).toBe('Test');
    expect(localStorage.getItem('authToken')).toBe('abc');
  });

  it('handles login error', async () => {
    mockedAxios.post.mockRejectedValueOnce({ response: { status: 401 } });

    let contextValue: AuthContextType;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {value => {
            contextValue = value!;
            return <button onClick={() => value!.login('123', 'badpw')}>Login</button>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Login'));
    await waitFor(() => expect(contextValue.error).toMatch(/(incorrect|échec)/i));
  });
}); 