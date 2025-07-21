'use client';

import { UserProvider } from '@auth0/nextjs-auth0/client';
import { shouldBypassAuth, mockUser } from '../lib/devSession';
import { createContext, useContext } from 'react';

// Create a context for the development bypass
const DevAuthContext = createContext();

export function DevUserProvider({ children }) {
  const bypass = shouldBypassAuth();

  if (bypass) {
    console.log('Using development auth bypass - mock user session active');
    
    // Create a mock context that mimics Auth0's useUser hook
    const mockContext = {
      user: mockUser,
      error: undefined,
      isLoading: false
    };

    return (
      <DevAuthContext.Provider value={mockContext}>
        {children}
      </DevAuthContext.Provider>
    );
  }

  // Use normal Auth0 UserProvider
  return <UserProvider>{children}</UserProvider>;
}

// Custom hook that works with both real Auth0 and development bypass
export function useDevUser() {
  const devContext = useContext(DevAuthContext);
  
  if (devContext) {
    return devContext;
  }

  // Fall back to Auth0's useUser if not in dev mode
  try {
    const { useUser } = require('@auth0/nextjs-auth0/client');
    return useUser();
  } catch (error) {
    return { user: null, error, isLoading: false };
  }
}