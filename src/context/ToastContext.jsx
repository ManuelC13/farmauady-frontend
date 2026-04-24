import { createContext, useContext, useState, useCallback, useMemo } from "react";
import Toast from "../components/common/ui/Toast";

const ToastContext = createContext();

let toastIdCounter = 0;

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast debe usarse dentro de un ToastProvider");
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const addToast = useCallback((message, type = "info", duration = 4000) => {
        const id = ++toastIdCounter;
        const toast = { id, message, type, duration };
        setToasts((prev) => [...prev, toast]);

        if (duration > 0) {
            setTimeout(() => removeToast(id), duration);
        }

        return id;
    }, [removeToast]);

    const success = useCallback((message, duration) => addToast(message, "success", duration), [addToast]);
    const error = useCallback((message, duration) => addToast(message, "error", duration), [addToast]);
    const warning = useCallback((message, duration) => addToast(message, "warning", duration), [addToast]);
    const info = useCallback((message, duration) => addToast(message, "info", duration), [addToast]);

    const value = useMemo(() => ({
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
    }), [addToast, removeToast, success, error, warning, info]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <Toast toasts={toasts} onClose={removeToast} />
        </ToastContext.Provider>
    );
};
