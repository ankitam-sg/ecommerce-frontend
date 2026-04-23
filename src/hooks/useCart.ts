import { useCartStore } from "../store/cartStore";
import { useCartActions } from "./useCartActions";
import { useCartTotals } from "./useCartTotals";
import { useToastStore } from "../store/toastStore";
import { TOAST_MESSAGES } from "../constants/toastMessages";
import { MAX_QTY } from "../constants/cartConfig";
import type { Product } from "../types/product";

/**
 * Convenience hook
 * Combines actions + derived state + side-effects (toast orchestration)
 * UI should ONLY use this
 */
export const useCart = () => {

    const cartItems = useCartStore((state) => state.cartItems);

    const baseActions = useCartActions();
    const totals = useCartTotals();

    const showToast = useToastStore((state) => state.showToast);

    // Wrapped Actions (store + toast mapping)

    const addItem = (product: Product, qty: number) => {
        const result = baseActions.addItem(product, qty);

        if (result === "limit") {
            showToast({
                msg: `Max ${MAX_QTY} items allowed`,
                type: "limit",
            });
            return;
        }

        showToast({
            msg: TOAST_MESSAGES.CART.ADD,
            type: "add",
        });
    };

    const removeItem = (id: number) => {
        baseActions.removeItem(id);

        showToast({
            msg: TOAST_MESSAGES.CART.REMOVE,
            type: "remove",
        });
    };

    const inc = (id: number) => {
        const result = baseActions.inc(id);

        if (result === "limit") {
            showToast({
                msg: `Max ${MAX_QTY} items allowed`,
                type: "limit",
            });
            return;
        }

        showToast({
            msg: TOAST_MESSAGES.CART.INC,
            type: "inc",
        });
    };

    const dec = (id: number) => {
        const result = baseActions.dec(id);

        if (result === "remove") {
            showToast({
                msg: TOAST_MESSAGES.CART.REMOVE,
                type: "remove",
            });
            return;
        }

        if (result === "dec") {
            showToast({
                msg: TOAST_MESSAGES.CART.DEC,
                type: "dec",
            });
        }
    };

    return {
        cartItems,

        // wrapped actions (use THESE, not store directly)
        addItem,
        removeItem,
        inc,
        dec,

        ...totals,
    };
};
