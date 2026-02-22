"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgb(245, 245, 245)",
            border: "1px solid rgb(229, 229, 229)",
          },
        }}
      />
      {children}
    </AuthProvider>
  );
}
