import { useAuthStore } from "../store/authStore";
import { useToast } from "./useToast";
import { TOAST_MESSAGES } from "../constants/toastMessages";

/**
 * Convenience hook
 * Combines auth actions + session state + success side-effects (toast orchestration)
 * UI should ONLY use this
 */

export const useAuth = () => {

    const { login, signup, logout, currentUser, users} = useAuthStore();

    const { showToast } = useToast();

    // Derived state → simple logged-in flag
    const isLoggedIn = !!currentUser;

    // LOGIN
    const loginUser = (email: string, password: string) => {

        const result = login(email, password);

        // Failures → RHF handles inline errors
        if (result !== "success") return result;
        
         // Success → Global Toast Feedback
        showToast({
            msg: TOAST_MESSAGES.AUTH.LOGIN_SUCCESS,
            type: "success",
        });

        return "success";
    };

    // SIGNUP
    const signupUser = (email: string, password: string) => {

        // check duplicate inside hook (not UI)
        const exists = users.find((u) => u.email === email);
        if (exists) return "exists";

        signup({ email, password });

        // Success → Global Toast Feedback
        showToast({
            msg: TOAST_MESSAGES.AUTH.SIGNUP_SUCCESS,
            type: "success",
        });

        return "success";
    };

    // LOGOUT
    const logoutUser = () => {

        logout();

        showToast({
            msg: TOAST_MESSAGES.AUTH.LOGOUT,
            type: "logout",
        });
    };

    return {
        currentUser,

        // derived state
        isLoggedIn,

        // wrapped actions (use these, not store directly)
        loginUser,
        signupUser,
        logoutUser,
    };
};
