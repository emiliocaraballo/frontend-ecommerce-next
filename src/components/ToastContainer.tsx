import { useToast } from "@/src/shared/hooks/use-toast";

export const ToastContainer = () => {
  const { toasts } = useToast();

  return (
    <div className="toast-container">
      {toasts.map((toast, index) => (
        <div key={index} className={`toast ${toast.variant}`}>
          <p>{toast.description}</p>
        </div>
      ))}
    </div>
  );
};
