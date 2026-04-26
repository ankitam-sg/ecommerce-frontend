import { useEffect, useRef } from "react";
import { useToastStore } from "../store/toastStore";
import { 
    FaCheckCircle, 
    FaTimesCircle, 
    FaPlusCircle, 
    FaMinusCircle, 
    FaBan,
} from "react-icons/fa";

const Toast = () => {

    // Get Toast Data from Global State (msg + type)
    const toast = useToastStore((state) => state.toast);

    // Function to Hide Toast manually
    const hideToast = useToastStore((state) => state.hideToast);

    // Track last toast time
    const lastToastTimeRef = useRef<number>(0);

    useEffect(() => {
        if (toast) {
            const now = Date.now();
            const diff = now - lastToastTimeRef.current;

            // simple rule:
            // fast clicks → short toast
            // normal clicks → longer toast
            const duration = diff < 300 ? 150 : 2000;

            lastToastTimeRef.current = now;

            const timer = setTimeout(() => {
                hideToast();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [toast, hideToast]);

    // If No Toast, render nothing
    if (!toast) return null;

    // decide icon + bg based on message
    const getToastConfig = () => {
        switch (toast.type) {
            
            // AUTH ACTIONS
            case "success":
                return { icon: <FaCheckCircle />, bg: "bg-green-600" };

            case "error":
                return { icon: <FaTimesCircle />, bg: "bg-red-600" };

            case "info":
                return { icon: <FaCheckCircle />, bg: "bg-blue-600" };

            case "warning":
                return { icon: <FaBan />, bg: "bg-yellow-600" };
            
            case "logout":
                return { icon: <FaTimesCircle />, bg: "bg-red-600" };
  
            // CART ACTIONS

            case "add":
                return { icon: <FaCheckCircle />, bg: "bg-green-700" };

            case "remove":
                return { icon: <FaTimesCircle />, bg: "bg-red-600" };

            case "inc":
                return { icon: <FaPlusCircle />, bg: "bg-lime-700" };

            case "dec":
                return { icon: <FaMinusCircle />, bg: "bg-amber-700" };

            case "limit":
                return { icon: <FaBan />, bg: "bg-red-800" };
            
            // Fallback UI (Safety Net)
            default:
                return { icon: <FaCheckCircle />, bg: "bg-gray-700" };
        }
    };

    const { icon, bg } = getToastConfig();

    return (
        <div
            className={`
                fixed bottom-5 right-5
                flex items-center gap-3
                px-4 py-2
                rounded-md shadow-lg
                text-sm font-medium
                text-white
                z-50
                ${bg}
            `}
        >
            {/* Icon */}
            <span className="text-lg">{icon}</span>

            {/* Message */}
            <span>{toast.msg}</span>
        </div>
    );
};

export default Toast;
