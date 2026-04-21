import { useCartStore } from "../store/cartStore";

/**
 * ONLY derived state
 * Pure calculations only
 * No actions allowed here
 */
export const useCartTotals = () => {

    const cartItems = useCartStore((state) => state.cartItems);

    const total = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    const totalItems = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    return {
        total,
        totalItems,
    };
};
