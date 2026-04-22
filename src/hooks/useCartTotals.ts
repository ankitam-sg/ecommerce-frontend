import { MAX_QTY } from "../constants/cartConfig";
import { useCartStore } from "../store/cartStore";

/**
 * ONLY derived state
 * Pure calculations only
 * No actions allowed here
 */
export const useCartTotals = () => {

    const cartItems = useCartStore((state) => state.cartItems);

    // Total Price of Cart
    const total = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    // Total No. of Items in Cart
    const totalItems = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    // Get quantity of specific product is already in Cart
    const getItemQty = (id: number) => {
        const item = cartItems.find(i => i.id === id);

        // if Not found, Quantity is 0
        return item ?.quantity ?? 0;
    }

    // how many more can be added for this product
    const getRemainingQty = (id: number) => {
        return MAX_QTY - getItemQty(id);
    }

    // check if product reached max limit
    const isMaxed = (id: number) => {
        return getRemainingQty(id) <= 0;
    }
 
    return {
        total,
        totalItems,

        getItemQty,
        getRemainingQty,
        isMaxed,
    };
};
