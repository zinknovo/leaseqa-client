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

const config = {
    success: {
        bgClass: "bg-gradient-green",
        icon: <FaCheckCircle size={20}/>,
        title: "Success"
    },
    error: {
        bgClass: "bg-gradient-red",
        icon: <FaExclamationCircle size={20}/>,
        title: "Error"
    }
};

export default function ToastNotification({toast, onClose}: ToastNotificationProps) {
    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(onClose, 4000);
            return () => clearTimeout(timer);
        }
    }, [toast.show, onClose]);

    if (!toast.show) return null;

    const {bgClass, icon, title} = config[toast.type];

    return (
        <div className="position-fixed top-0 end-0 p-3 animate-slide-in" style={{zIndex: 9999}}>
            <div className={`d-flex align-items-start gap-3 text-white p-3 shadow-lg rounded-3 ${bgClass}`}
                 style={{minWidth: 300, maxWidth: 400}}>
                <div className="flex-shrink-0 mt-1">{icon}</div>
                <div className="flex-grow-1">
                    <div className="fw-bold mb-1">{title}</div>
                    <div className="small opacity-90">{toast.message}</div>
                </div>
                <button onClick={onClose} className="btn btn-link p-0 text-white opacity-75">
                    <FaTimes size={16}/>
                </button>
            </div>
        </div>
    );
}