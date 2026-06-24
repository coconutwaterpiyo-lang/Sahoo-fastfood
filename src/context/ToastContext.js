import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastStack toasts={toasts} />
    </ToastContext.Provider>
  );
}

function ToastStack({ toasts }) {
  const Gold = "#D4AF37";
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            background: t.type === "error" ? "#C62828" : t.type === "info" ? "#1A1A2E" : `linear-gradient(135deg,${Gold},#B8860B)`,
            color: t.type === "info" ? Gold : t.type === "error" ? "#fff" : "#000",
            padding: "12px 20px",
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 14,
            boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
            animation: "slideIn 0.3s ease",
            border: `1px solid ${Gold}55`,
            maxWidth: 320,
          }}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
};
