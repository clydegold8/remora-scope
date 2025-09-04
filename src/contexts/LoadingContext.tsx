import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  loadingStates: Record<string, boolean>;
  setLoadingState: (key: string, loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const setLoadingState = (key: string, loading: boolean) => {
    setLoadingStates(prev => {
      const newStates = { ...prev, [key]: loading };
      const anyLoading = Object.values(newStates).some(state => state);
      setIsLoading(anyLoading);
      return newStates;
    });
  };

  return (
    <LoadingContext.Provider value={{
      isLoading,
      setIsLoading,
      loadingStates,
      setLoadingState
    }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading(key?: string) {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }

  if (key) {
    return {
      isLoading: context.loadingStates[key] || false,
      setLoading: (loading: boolean) => context.setLoadingState(key, loading)
    };
  }

  return {
    isLoading: context.isLoading,
    setLoading: context.setIsLoading
  };
}