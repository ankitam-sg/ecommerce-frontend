import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

type ProtectedRouteProps = {
    children: ReactNode;
    requiresAuth?: boolean;
    requiresCart?: boolean;
};

const ProtectedRoute = ({
    children,
    requiresAuth = false,
    requiresCart = false,
}: ProtectedRouteProps) => {

    const location = useLocation();

    // ✅ correct auth usage
    const { isLoggedIn } = useAuth();

    // ✅ cart is correct
    const { cartItems } = useCart();

    // -----------------------------
    // AUTH CHECK
    // -----------------------------
    if (requiresAuth && !isLoggedIn) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    // -----------------------------
    // CART CHECK
    // -----------------------------
    if (requiresCart && cartItems.length === 0) {
        return <Navigate to="/cart" replace />;
    }

    // -----------------------------
    // ALLOW ACCESS
    // -----------------------------
    return <>{children}</>;
};

export default ProtectedRoute;
