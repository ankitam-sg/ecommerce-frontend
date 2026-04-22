import { useEffect } from "react";
import { useToastStore } from "../store/toastStore";
import { 
    FaCheckCircle, 
    FaTimesCircle, 
    FaPlusCircle, 
    FaMinusCircle, 
    FaBan
} from "react-icons/fa";

const Toast = () => {

    // Get Toast Data from Global State
    const toast = useToastStore((state) => state.toast);

    // Hide Toast function
    const hideToast = useToastStore((state) => state.hideToast);

    // Auto-hide Toast after 2 sec
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => {
                hideToast();
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [toast, hideToast]);

    // If No Toast, render nothing
    if (!toast) return null;

    // decide icon + bg based on message
    const getToastConfig = () => {
        switch (toast.type) {
            case "add":
                return {
                    icon: <FaCheckCircle />,
                    bg: "bg-green-700",
                };

            case "remove":
                return {
                    icon: <FaTimesCircle />,
                    bg: "bg-red-600",
                };

            case "inc":
                return {
                    icon: <FaPlusCircle />,
                    bg: "bg-lime-700",
                };

            case "dec":
                return {
                    icon: <FaMinusCircle />,
                    bg: "bg-amber-700",
                };

            case "limit": 
            return {
                icon: <FaBan />,
                bg: "bg-red-800",
            };

            default:
                console.warn("Unknown toast type:", toast.type);
                return {
                    icon: <FaCheckCircle />,
                    bg: "bg-gray-700",
                };
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
            <span className="text-lg">
                {icon}
            </span>

            {/* Message */}
            <span>
                {toast.msg}
            </span>
        </div>
    );
};

export default Toast;
