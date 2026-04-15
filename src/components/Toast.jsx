import { useEffect, useState } from "react";
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";

const variants = {
    success: {
        container: "bg-gradient-to-br from-emerald-500/95 to-emerald-600/95 text-emerald-50",
        icon: "bg-white/20 text-emerald-100",
        Icon: CheckCircle,
    },
    error: {
        container: "bg-gradient-to-br from-red-500/95 to-red-600/95 text-red-50",
        icon: "bg-white/20 text-red-100",
        Icon: AlertCircle,
    },
    warning: {
        container: "bg-gradient-to-br from-amber-500/95 to-amber-600/95 text-amber-50",
        icon: "bg-white/20 text-amber-100",
        Icon: AlertTriangle,
    },
    info: {
        container: "bg-gradient-to-br from-blue-500/95 to-blue-600/95 text-blue-50",
        icon: "bg-white/20 text-blue-100",
        Icon: Info,
    },
};

function ToastItem({ toast, onClose }) {
    const [isExiting, setIsExiting] = useState(false);
    const variant = variants[toast.type] || variants.info;
    const IconComponent = variant.Icon;

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => onClose(toast.id), 300);
    };

    useEffect(() => {
        if (toast.duration > 0) {
            const exitTimer = setTimeout(() => {
                setIsExiting(true);
            }, toast.duration - 300);
            return () => clearTimeout(exitTimer);
        }
    }, [toast.duration]);

    return (
        <div
            className={`
                relative flex items-center gap-3 px-4 py-3.5 rounded-xl
                border border-white/10 backdrop-blur-xl
                shadow-[0_8px_32px_rgba(0,0,0,0.18),0_2px_8px_rgba(0,0,0,0.1)]
                pointer-events-auto overflow-hidden
                ${variant.container}
                ${isExiting ? "animate-toast-out" : "animate-toast-in"}
            `}
            role="alert"
            aria-live="assertive"
        >
            {/* Icono */}
            <div className={`flex items-center justify-center w-8 h-8 min-w-8 rounded-lg shrink-0 ${variant.icon}`}>
                <IconComponent size={18} strokeWidth={2.5} />
            </div>

            {/* Mensaje */}
            <p className="flex-1 m-0 text-sm font-medium leading-snug tracking-wide">
                {toast.message}
            </p>

            {/* Botón cerrar */}
            <button
                onClick={handleClose}
                className="flex items-center justify-center w-6.5 h-6.5 min-w-6.5 rounded-md bg-white/12 text-inherit cursor-pointer border-none hover:bg-white/25 transition-colors shrink-0"
                aria-label="Cerrar notificación"
            >
                <X size={14} strokeWidth={2.5} />
            </button>

            {/* Barra de progreso */}
            {toast.duration > 0 && (
                <div
                    className="absolute bottom-0 left-0 h-[3px] w-full bg-white/35 rounded-b-xl origin-left"
                    style={{
                        animation: `toast-progress ${toast.duration}ms linear forwards`,
                    }}
                />
            )}
        </div>
    );
}

function Toast({ toasts, onClose }) {
    if (toasts.length === 0) return null;

    return (
        <div
            className="fixed top-6 right-6 z-9999 flex flex-col gap-3 max-w-[420px] w-[calc(100%-48px)] pointer-events-none max-sm:top-4 max-sm:right-4 max-sm:w-[calc(100%-32px)]"
            aria-label="Notificaciones"
        >
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onClose={onClose} />
            ))}
        </div>
    );
}

export default Toast;
