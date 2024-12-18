/* eslint-disable @typescript-eslint/no-explicit-any */
// src/shared/hooks/use-toast.ts
import { useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState<any[]>([]);

  const toast = ({ description, variant }: { description: string, variant: string }) => {
    setToasts((prev) => [...prev, { description, variant }]);
  };

  return { toast, toasts };
}
