import { useCartStore } from "../store/cartStore";

/**
 * ONLY cart mutations
 * No derived logic here
 * No UI logic here
 */
export const useCartActions = () => {

    const addItem = useCartStore((state) => state.addItem);
    const removeItem = useCartStore((state) => state.removeItem);
    const incQty = useCartStore((state) => state.incQty);
    const decQty = useCartStore((state) => state.decQty);

    return {
        addItem,
        removeItem,
        inc: incQty,
        dec: decQty,
    };
};
