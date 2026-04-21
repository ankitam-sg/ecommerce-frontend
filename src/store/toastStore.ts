import { create } from "zustand";

// Toast type (what msg + type of alert)
type Toast = {
    msg: string,
    type: "add" | "remove" | "inc" | "dec" | "limit"
};

type ToastStore = {
    toast: Toast | null;
    showToast: (toast: Toast) => void;      // Show Toast on Screen
    hideToast: () => void;                          // Hide Toast from Screen
};

export const useToastStore = create<ToastStore>((set) => ({
    toast: null,

    // Set Toast msg in Global State
    showToast: (toast) => set({ toast }),

    // Clear Toast from State
    hideToast: () => set({ toast: null }),
}));