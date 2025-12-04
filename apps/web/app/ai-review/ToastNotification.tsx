"use client";

import {useEffect} from "react";
import {FaCheckCircle, FaExclamationCircle, FaTimes} from "react-icons/fa";

export type ToastType = "success" | "error";

export type ToastData = {
    show: boolean;
    message: string;
    type: ToastType;
};

type ToastNotificationProps = {
    toast: ToastData;
    onClose: () => void;
};

export default function ToastNotification({toast, onClose}: ToastNotificationProps) {
    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                onClose();
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [toast.show, onClose]);

    if (!toast.show) return null;

    const styles = {
        success: {
            bg: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
            icon: <FaCheckCircle size={20}/>,
            title: "Success"
        },
        error: {
            bg: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            icon: <FaExclamationCircle size={20}/>,
            title: "Error"
        }
    };

    const style = styles[toast.type];

    return (
        <div
            style={{
                position: "fixed",
                top: 20,
                right: 20,
                zIndex: 9999,
                animation: "slideIn 0.3s ease"
            }}
        >
            <style>
                {`
                    @keyframes slideIn {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                `}
            </style>
            <div
                className="d-flex align-items-start gap-3 text-white p-3 shadow-lg"
                style={{
                    background: style.bg,
                    borderRadius: "0.75rem",
                    minWidth: 300,
                    maxWidth: 400
                }}
            >
                <div className="flex-shrink-0 mt-1">
                    {style.icon}
                </div>
                <div className="flex-grow-1">
                    <div className="fw-bold mb-1">{style.title}</div>
                    <div className="small" style={{opacity: 0.9}}>
                        {toast.message}
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="btn btn-link p-0 text-white"
                    style={{opacity: 0.7}}
                >
                    <FaTimes size={16}/>
                </button>
            </div>
        </div>
    );
}