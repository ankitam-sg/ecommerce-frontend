import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "../types/product";

// Single item inside cart
type CartItem = {
    id: number,
    product: Product,
    quantity: number,
};

type CartStore = {
    cartItems: CartItem[];

    addItem: (product: Product, quantity: number) => void;
    removeItem: (id: number) => void;
    incQty: (id: number) => void;
    decQty: (id: number) => void;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            
            cartItems: [],

            // Add item OR Increase if exists
            addItem: (product, quantity) =>
                set((state) => {
                    const existing = state.cartItems.find(
                        (item) => item.id === product.id
                    );

                    if (existing) {
                        // If Item already exists → Increase Quantity by Selected Amount
                        return {
                            cartItems: state.cartItems.map((item) =>
                                item.id === product.id
                                    ? { 
                                            ...item, 
                                            quantity: item.quantity + quantity 
                                    }
                                    :item
                            ),
                        };
                    }

                    // Add New Item with Selected Quantity
                    return {
                        cartItems: [
                            ...state.cartItems,
                            { id: product.id, product, quantity },
                        ],
                    };
                }
            ),

            // Remove Item completely from Cart
            removeItem: (id) =>
                set((state) => ({
                    cartItems: state.cartItems.filter(
                        (item) => item.id !== id
                    ),
                })),

            // Increase Quantity of a specific Item
            incQty: (id) => 
                set((state) => ({
                    cartItems: state.cartItems.map((item) => 
                        item.id === id
                            ? { 
                                    ...item,
                                    quantity: item.quantity + 1 
                            }
                            : item
                    ),
                })
            ),
        
            // Decrease Quantity OR Remove if 1
            decQty: (id) => 
                set((state) => ({
                    cartItems: state.cartItems
                        .map((item) => 
                            item.id === id
                                ? { 
                                        ...item, 
                                        quantity: item.quantity - 1 
                                }
                                : item
                        )
                        .filter((item) => item.quantity > 0),       // Auto-remove if 0
                })),
        }),

        {
            name: "cart-storage",       // Key in localStorage
        }
    )
);