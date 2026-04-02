'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface VerificationState {
  step: 'form' | 'verify';
  email: string | null;
  loading: boolean;
  error: string | null;
}

interface VerificationContextType extends VerificationState {
  initiateVerification: (email: string) => Promise<boolean>;
  verifyAndRegister: (code: string, registerAction: any, formData: any) => Promise<boolean>;
  resendCode: () => Promise<boolean>;
  clearError: () => void;
  reset: () => void;
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export function VerificationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VerificationState>({
    step: 'form',
    email: null,
    loading: false,
    error: null,
  });

  const initiateVerification = async (email: string): Promise<boolean> => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const res = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Error al enviar el código');
      }
      
      setState(s => ({ ...s, step: 'verify', email, loading: false }));
      return true;
    } catch (error: any) {
      setState(s => ({ ...s, error: error.message, loading: false }));
      return false;
    }
  };

  const verifyAndRegister = async (code: string, registerAction: any, formData: any): Promise<boolean> => {
    if (!state.email) return false;
    setState(s => ({ ...s, loading: true, error: null }));
    
    try {
      // Registrar el usuario en la DB (esta misma action ahora verifica el código directamente)
      const result = await registerAction({ ...formData, code });
      if (!result.status) {
        throw new Error(result.message);
      }
      
      setState(s => ({ ...s, loading: false }));
      return true;
    } catch (error: any) {
      setState(s => ({ ...s, error: error.message, loading: false }));
      return false;
    }
  };

  const resendCode = async (): Promise<boolean> => {
    if (!state.email) return false;
    return initiateVerification(state.email);
  };

  const clearError = () => setState(s => ({ ...s, error: null }));
  
  const reset = () => setState({
    step: 'form',
    email: null,
    loading: false,
    error: null,
  });

  return (
    <VerificationContext.Provider value={{
      ...state,
      initiateVerification,
      verifyAndRegister,
      resendCode,
      clearError,
      reset
    }}>
      {children}
    </VerificationContext.Provider>
  );
}

export function useVerification() {
  const context = useContext(VerificationContext);
  if (context === undefined) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
}
