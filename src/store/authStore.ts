import { create } from "zustand"
import { persist } from "zustand/middleware"

export type User = {
    email: string,
    password: string,
}

export type LoginStatus = "success" | "no-user" | "wrong-password";

type AuthStore = {
    users: User[],
    currentUser: User | null;

    signup: (user: User) => void;
    login: (email: string, password: string) => LoginStatus; 
    logout: () => void,
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            users: [],                      // All Registered Users
            currentUser: null,      // Active Logged-in User

            // Signup → Store User + Auto-Login (FrontEnd Simulation)
            signup: (user) => {
                
                // prevent duplicate users (safety layer)
                const existing = get().users.find(u => u.email === user.email);
                if (existing) return;

                set((state) => ({
                    users: [...state.users, user],    // Store new User
                    currentUser: user,                  // Auto-Login after Signup
                }))
            },

            // Login
            login: (email, password) => {

                // find user by email only -  check if email exists
                const user = get().users.find(
                    (u) => u.email === email        
                );

                // Email not registered
                if (!user) return "no-user";

                // Password mismatch
                if (user.password !== password) return "wrong-password";

                // Success → Set session
                set({ currentUser: user });
                return "success";
            },

            // Logout → Clear current session
            logout: () => {
                set({ currentUser: null });
            },
        }),

        {
            name: "auth-storage",   // localStorage key for auth persistence
        }
    )
);
