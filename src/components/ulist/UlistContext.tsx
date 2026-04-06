"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface UlistContextType {
  showToast: (message: string, type: ToastType) => void;
  toasts: Toast[];
}

const UlistContext = createContext<UlistContextType | undefined>(undefined);

export function UlistProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <UlistContext.Provider value={{ showToast, toasts }}>
      {children}
      
      {/* Toast Container */}
      <div className="toast toast-end toast-bottom z-[100]">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`alert ${
              toast.type === "success" ? "alert-success" :
              toast.type === "error" ? "alert-error" :
              toast.type === "warning" ? "alert-warning" : "alert-info"
            } animate-in slide-in-from-right duration-300`}
          >
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </UlistContext.Provider>
  );
}

export function useUlist() {
  const context = useContext(UlistContext);
  if (context === undefined) {
    throw new Error("useUlist must be used within a UlistProvider");
  }
  return context;
}
