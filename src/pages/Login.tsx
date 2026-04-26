import { useForm } from "react-hook-form";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type LoginForm = {
    email: string;
    password: string;
};

const Login = () => {

    const navigate = useNavigate();
    const location = useLocation();     // To handle redirect back after login

    // auth wrapper (handles success toast)
    const { loginUser } = useAuth();

    // Extract correct redirect path safely
    const from = location.state?.from?.pathname || "/products";

    // RHF setup
    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields }, 
        setError,
    } = useForm<LoginForm>({
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onTouched",                  // Start validation after first touch
        reValidateMode: "onChange"  // Live validation while typing
    });

    // Submit handler
    const onSubmit = (data: LoginForm) => {

        const result = loginUser(data.email, data.password); 

        // User not registered
        if (result === "no-user") {
            setError("email", {
                type: "manual",
                message: "User not found. Please sign up first.",
            });
            return;
        }

        // Wrong Password
        if (result === "wrong-password") {
            setError("password", {
                type: "manual",
                message: "Incorrect password.",
            });
            return;
        }

        // Use correct redirect path
        navigate(from, { replace: true });
    };

    return (
        <div className="flex-1 flex w-full items-center justify-center bg-gray-100">

            <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow">

                {/* Title */}
                <h2 className="text-xl font-bold text-center mb-4">
                    Login
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Email :
                        </label>

                        <input
                            type="email"
                            placeholder="Enter Email"
                            className={`
                                w-full p-2 rounded border
                                outline-none focus:outline-none focus:ring-0 

                                ${touchedFields.email && errors.email
                                    ? "border-red-500" 
                                    : "border-gray-300 focus:border-gray-400"} 
                            `}
                            {...register("email", {
                                required: "Email is required.",
                            })}
                        />

                        {/* Show error only after field touch */}
                        {touchedFields.email && errors.email && ( 
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Password :
                        </label>

                        <input
                            type="password"
                            placeholder="Enter Password"
                            className={`
                                w-full p-2 rounded border
                                outline-none focus:outline-none focus:ring-0

                                ${touchedFields.password && errors.password
                                    ? "border-red-500"
                                    : "border-gray-300 focus:border-gray-400"}
                            `}

                            {...register("password", {
                                required: "Password is required.",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters long.",
                                },
                            })}
                        />

                        {/* Show error only after field touch */}
                        {touchedFields.password && errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="
                            w-full bg-blue-600 text-white py-2 rounded
                            hover:bg-blue-700 active:scale-95 transition
                        "
                    >
                        Login
                    </button>

                </form>

                {/* Signup redirect */}
                <p className="text-sm text-center mt-3">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="text-blue-600 underline">
                        Sign Up
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Login;
