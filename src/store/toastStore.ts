import { create } from "zustand";

// Toast type (what msg + type of alert)
export type Toast = {
    msg: string,
    type: 
        // Generic types for auth & further features
         "success" | "error" | "info" | "warning" | "logout"

        // types for Cart 
        | "add" | "remove" | "inc" | "dec" | "limit"; 
};


type ToastStore = {
    toast: Toast | null;
    showToast: (toast: Toast) => void;      // Show Toast on Screen
    hideToast: () => void;                  // Hide Toast from Screen
};

let timeoutId: ReturnType<typeof setTimeout>;

export const useToastStore = create<ToastStore>((set) => ({
    toast: null,

    // Set Toast msg in Global State + auto-dismiss
    showToast: (toast) => {

        // prevent stacking / race condition
        if (timeoutId) clearTimeout(timeoutId);

        set({ toast });

        timeoutId = setTimeout(() => {
            set({ toast: null });
        }, 2000);
    },

    // Clear Toast from State manually
    hideToast: () => {
        if (timeoutId) clearTimeout(timeoutId);
        set({ toast: null });
    },
}));
