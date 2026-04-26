import { useCart } from "../hooks/useCart";
import { useCartStore } from "../store/cartStore"; 
import { useToast } from "../hooks/useToast";
import { useNavigate } from "react-router-dom"; 
import { useEffect, useRef } from "react";

const Checkout = () => {

    // Navigation
    const navigate = useNavigate();

    // Cart Data
    const { cartItems, total, totalItems } = useCart();

    // Actions
    const clearCart = useCartStore((state) => state.clearCart);     // Clearing Cart after Order
    const { showToast } = useToast();

    // track order placement to control redirect flow
    const isOrderPlaced = useRef(false);

    // Redirect if Cart becomes empty
    useEffect(() => {
        if (!isOrderPlaced.current && cartItems.length === 0) {
            navigate("/cart", { replace: true });
        }
    }, [cartItems, navigate]);

    // Place order handler (fake checkout - Simulation only)
    const handlePlaceOrder = () => {

        isOrderPlaced.current = true; // marking order completion

        // First redirect to Products after Order
        navigate("/products", { replace: true }); 

        // Reset Cart
        clearCart();

        // Show Confirmation Toast
        showToast({
            msg: "Order placed successfully!",
            type: "success", 
        });       
    };

    return (
        <div className="max-w-3xl mx-auto p-5 space-y-5">

            {/* Heading */}
            <h1 className="text-xl underline font-bold">
                Order Summary
            </h1>

            <p className="text-xs text-gray-500">
    This is a simulated order. No real payment is processed.
</p>


            {/* Item List */}
            <div className="space-y-3">
                {cartItems.map((item) => (
                    <div
                        key={item.id}
                        className="flex justify-between items-center border p-3 rounded-md"
                    >

                        {/* Product Info */}
                        <div>
                            <p className="font-medium">
                                {item.product.title}
                            </p>

                            <p className="text-sm text-gray-500">
                                Quantity: {item.quantity}
                            </p>
                        </div>

                        {/* Price */}
                        <p className="font-semibold">
                            ${(item.product.price * item.quantity).toFixed(2)}
                        </p>

                    </div>
                ))}
            </div>

            {/* Summary Box */}
            <div className="border-t pt-4 space-y-2">

                <div className="flex justify-between">
                    <span>Total Items</span>
                    <span>{totalItems}</span>
                </div>

                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>

            </div>

            {/* Place Order Button */}
            <button
                onClick={handlePlaceOrder}
                className="
                    w-full py-2
                    bg-green-600 text-white
                    rounded-md
                    hover:bg-green-700   /* FIXED: removed space */
                    active:scale-95
                    transition
                "
            >
                Place Order
            </button>

        </div>
    );
};

export default Checkout;
