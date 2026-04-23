import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type SignupForm = {
    email: string;
    password: string;
    confirmPassword: string;
};

const Signup = () => {

    const navigate = useNavigate();

    // auth hook (single source of truth)
    const { signupUser } = useAuth();

    // RHF setup
    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields },
        setError,
        watch,
    } = useForm<SignupForm>({
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
        mode: "onTouched",                      // Start validation after first touch
        reValidateMode: "onChange"      // Live validation while typing
    });

    // Watch password for confirm validation
    const passwordValue = watch("password");

    // Submit handler
    const onSubmit = (data: SignupForm) => {

        // single source of truth
        const result = signupUser(data.email, data.password);

        // duplicate user
        if (result === "exists") {
            setError("email", {
                type: "manual",
                message: "User already exists with this email.",
            });
            return;
        }

        // success → store already auto-logs user in
        navigate("/products");
    };

    return (
        <div className="flex-1 flex w-full items-center justify-center bg-gray-100">

            <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow">

                {/* Title */}
                <h2 className="text-xl font-bold text-center mb-4">
                    Sign Up
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

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Confirm Password :
                        </label>

                        <input
                            type="password"
                            placeholder="Enter Confirm Password"
                            className={`
                                w-full p-2 rounded border
                                outline-none focus:outline-none focus:ring-0

                                ${touchedFields.confirmPassword && errors.confirmPassword
                                    ? "border-red-500"
                                    : "border-gray-300 focus:border-gray-400"}
                            `}
                            
                            {...register("confirmPassword", {
                                required: "Confirm Password is required.",
                                validate: (value) =>
                                    value === passwordValue || "Passwords do not match.",
                            })}
                        />

                        {/* Show error only after field touch */}
                        {touchedFields.confirmPassword && errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.confirmPassword.message}
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
                        Sign Up
                    </button>

                </form>

                {/* Login redirect */}
                <p className="text-sm text-center mt-3">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 underline">
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Signup;
