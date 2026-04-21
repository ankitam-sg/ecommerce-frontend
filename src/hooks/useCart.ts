import { useCartStore } from "../store/cartStore";
import { useCartActions } from "./useCartActions";
import { useCartTotals } from "./useCartTotals";

/**
 * Convenience hook
 * Combines actions + derived state
 * UI uses this most of the time
 */
export const useCart = () => {

    const cartItems = useCartStore((state) => state.cartItems);

    const actions = useCartActions();
    const totals = useCartTotals();

    return {
        cartItems,
        ...actions,
        ...totals,
    };
};
