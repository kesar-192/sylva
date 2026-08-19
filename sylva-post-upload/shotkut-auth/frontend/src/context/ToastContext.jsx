import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 2600);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 toast-in">
          <div className="glass rounded-full px-4 py-2.5 flex items-center gap-2 shadow-glow-teal">
            {toast.type === "success" ? (
              <CheckCircle2 size={16} className="text-teal" />
            ) : (
              <XCircle size={16} className="text-red-400" />
            )}
            <span className="text-sm text-paper">{toast.message}</span>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
