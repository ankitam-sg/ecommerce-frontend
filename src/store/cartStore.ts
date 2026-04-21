import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "../types/product";
import { useToastStore } from "./toastStore";
import { MAX_QTY } from "../constants/cartConfig"; 
import { TOAST_MESSAGES } from "../constants/toastMessages"; 

type CartItem = {
    id: number;
    product: Product;
    quantity: number;
};

type CartStore = {
    cartItems: CartItem[];

    addItem: (product: Product, quantity: number) => void;
    removeItem: (id: number) => void;
    incQty: (id: number) => void;
    decQty: (id: number) => void;
};

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({

            cartItems: [],

            // Add new item OR merge quantity (with max cap)
            addItem: (product, quantity) => {

                const { showToast } = useToastStore.getState();

                set((state) => {
                    const existing = state.cartItems.find(
                        (item) => item.id === product.id
                    );

                    // If already exists → merge but don't exceed MAX_QTY
                    if (existing) {

                        if (existing.quantity >= MAX_QTY) {
                            showToast({
                                msg: `Max ${MAX_QTY} items allowed`, // dynamic message
                                type: "limit",
                            });
                            return state;
                        }

                        const updatedQty = Math.min(
                            existing.quantity + quantity,
                            MAX_QTY
                        );

                        return {
                            cartItems: state.cartItems.map((item) =>
                                item.id === product.id
                                    ? { ...item, quantity: updatedQty }
                                    : item
                            ),
                        };
                    }

                    // New item → clamp initial quantity
                    return {
                        cartItems: [
                            ...state.cartItems,
                            {
                                id: product.id,
                                product,
                                quantity: Math.min(quantity, MAX_QTY),
                            },
                        ],
                    };
                });

                // Toast handled ONLY here (UI should not duplicate)
                showToast({
                    msg: TOAST_MESSAGES.CART.ADD,
                    type: "add",
                });
            },

            // Remove item completely
            removeItem: (id) => {

                const { showToast } = useToastStore.getState();

                set((state) => ({
                    cartItems: state.cartItems.filter(
                        (item) => item.id !== id
                    ),
                }));

                showToast({
                    msg: TOAST_MESSAGES.CART.REMOVE,
                    type: "remove",
                });
            },

            // Increase quantity with max limit enforcement
            incQty: (id) => {

                const { showToast } = useToastStore.getState();

                set((state) => {

                    const item = state.cartItems.find(i => i.id === id);
                    if (!item) return state;

                    // Block if already at max
                    if (item.quantity >= MAX_QTY) {
                        showToast({
                            msg: `Max ${MAX_QTY} items allowed`,
                            type: "limit",
                        });
                        return state;
                    }

                    // Valid increment
                    showToast({
                        msg: TOAST_MESSAGES.CART.INC,
                        type: "inc",
                    });

                    return {
                        cartItems: state.cartItems.map((item) =>
                            item.id === id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    };
                });
            },

           // Decrease quantity OR remove if reaches 0
            decQty: (id) => {

                const { showToast } = useToastStore.getState();

                set((state) => {

                    const item = state.cartItems.find(i => i.id === id);
                    if (!item) return state;

                    const isLast = item.quantity === 1;

                    // Decide correct toast BEFORE updating state
                    if (isLast) {
                        showToast({
                            msg: TOAST_MESSAGES.CART.REMOVE,
                            type: "remove",
                        });
                    } else {
                        showToast({
                            msg: TOAST_MESSAGES.CART.DEC,
                            type: "dec",
                        });
                    }

                    return {
                        cartItems: state.cartItems
                            .map((item) =>
                                item.id === id
                                    ? { ...item, quantity: item.quantity - 1 }
                                    : item
                            )
                            .filter((item) => item.quantity > 0),
                    };
                });
            },
        }),
        {
            name: "cart-storage",   // persist storage
        }
    )
);
