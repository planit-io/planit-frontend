"use client";

import { useToast } from "@/contexts/toast-context";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function ToastContainer() {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none">
            {toasts.map((toast) => (
                <ToastItem
                    key={toast.id}
                    id={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={removeToast}
                />
            ))}
        </div>
    );
}

interface ToastItemProps {
    id: string;
    message: string;
    type: "success" | "error" | "info";
    onClose: (id: string) => void;
}

function ToastItem({ id, message, type, onClose }: ToastItemProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation on mount
        setTimeout(() => setIsVisible(true), 10);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose(id), 300); // Wait for exit animation
    };

    const config = {
        success: {
            icon: CheckCircle,
            bgColor: "bg-green-50",
            borderColor: "border-green-200",
            iconColor: "text-green-600",
            textColor: "text-green-800",
        },
        error: {
            icon: XCircle,
            bgColor: "bg-red-50",
            borderColor: "border-red-200",
            iconColor: "text-red-600",
            textColor: "text-red-800",
        },
        info: {
            icon: Info,
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
            iconColor: "text-blue-600",
            textColor: "text-blue-800",
        },
    };

    const { icon: Icon, bgColor, borderColor, iconColor, textColor } = config[type];

    return (
        <div
            className={`
                pointer-events-auto
                flex items-center gap-3 px-4 py-3 rounded-lg border-2 shadow-lg
                min-w-[320px] max-w-md
                transition-all duration-300 ease-out
                ${bgColor} ${borderColor}
                ${isVisible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0"
                }
            `}
        >
            <Icon className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
            <p className={`flex-1 text-sm font-medium ${textColor}`}>{message}</p>
            <button
                onClick={handleClose}
                className={`flex-shrink-0 p-1 rounded-md hover:bg-white/50 transition-colors ${iconColor}`}
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
