import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "../types/product";
import { MAX_QTY } from "../constants/cartConfig";

type CartItem = {
    id: number;
    product: Product;
    quantity: number;
};

// Action result types (store → caller contract)
export type AddItemStatus = "added" | "limit";
export type IncStatus = "inc" | "limit";
export type DecStatus = "dec" | "remove" | null;

type CartStore = {
    cartItems: CartItem[];

    addItem: (product: Product, quantity: number) => AddItemStatus;
    removeItem: (id: number) => void;
    incQty: (id: number) => IncStatus;
    decQty: (id: number) => DecStatus;
};

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({

            cartItems: [],

            // Add new item OR merge quantity (PURE: no side-effects)
            addItem: (product, quantity) => {

                let status: AddItemStatus = "added";

                set((state) => {
                    const existing = state.cartItems.find(
                        (item) => item.id === product.id
                    );

                    // Existing item
                    if (existing) {

                        if (existing.quantity >= MAX_QTY) {
                            status = "limit";
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

                    // New item
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

                return status;
            },

            // Remove item (PURE)
            removeItem: (id) => {
                set((state) => ({
                    cartItems: state.cartItems.filter(
                        (item) => item.id !== id
                    ),
                }));
            },

            // Increase quantity (PURE)
            incQty: (id) => {

                let status: IncStatus = "inc";

                set((state) => {

                    const item = state.cartItems.find(i => i.id === id);
                    if (!item) return state;

                    if (item.quantity >= MAX_QTY) {
                        status = "limit";
                        return state;
                    }

                    return {
                        cartItems: state.cartItems.map((item) =>
                            item.id === id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    };
                });

                return status;
            },

            // Decrease quantity OR remove (PURE)
            decQty: (id) => {

                let status: DecStatus = null;

                set((state) => {

                    const item = state.cartItems.find(i => i.id === id);
                    if (!item) return state;

                    const isLast = item.quantity === 1;

                    status = isLast ? "remove" : "dec";

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

                return status;
            },
        }),
        {
            name: "cart-storage",
        }
    )
);
