import { useCart } from "../hooks/useCart"; 
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { MAX_QTY } from "../constants/cartConfig"; 

const Cart = () => {

    // Custom hook → abstracts Zustand logic (UI should NOT know store details)
    const {
        cartItems,
        inc,
        dec,
        removeFromCart,
        total,
        totalItems
    } = useCart();

    // Empty cart state
    if (cartItems.length === 0) {
        return (
            <p className="p-4 text-center text-gray-500">
                Your cart is empty.
            </p>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-4">

            {/* Cart Items */}
            {cartItems.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-lg p-4 bg-white border border-gray-100 shadow-sm"
                >

                    {/* Product Image */}
                    <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="h-20 w-20 object-contain"
                    />

                    {/* Product Info */}
                    <div className="flex-1">

                        {/* Title */}
                        <h2 className="text-sm font-semibold line-clamp-2">
                            {item.product.title}
                        </h2>

                        {/* Price */}
                        <p className="font-bold mt-1">
                            ${item.product.price}
                        </p>

                        {/* Subtotal per item (derived UI state) */}
                        <p className="text-sm text-gray-500 mt-1">
                            Subtotal: ${(item.product.price * item.quantity).toFixed(2)}
                        </p>

                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">

                        {/* Decrease → store handles min + toast logic */}
                        <button
                            onClick={() => dec(item.id)}
                            disabled={item.quantity === 1}
                            title="Decrease Quantity"
                            className="
                                flex items-center justify-center w-8 h-8 rounded-md 
                                bg-gray-200 text-gray-800
                                disabled:opacity-50 disabled:cursor-not-allowed
                            "
                        >
                            <FaMinus size={12} />
                        </button>

                        {/* Quantity Display (read-only UI state) */}
                        <div className="flex items-center justify-center w-10 h-8 rounded-md
                                        bg-white text-gray-900 font-medium
                                        border border-gray-400">
                            {item.quantity}
                        </div>

                        {/* Increase → NO UI toast here, store handles MAX logic */}
                        <button
                            onClick={() => inc(item.id)}
                            title="Increase Quantity"
                            className={`
                                flex items-center justify-center w-8 h-8 rounded-md 
                                bg-gray-200 text-gray-800
                                ${item.quantity === MAX_QTY ? "opacity-50 cursor-not-allowed" : ""}
                                hover:border-gray-700
                                active:scale-90
                                transition-all duration-150
                            `}
                        >
                            <FaPlus size={12} />
                        </button>

                    </div>

                    {/* Remove Item */}
                    <button
                        onClick={() => removeFromCart(item.id)}
                        title="Remove Item"
                        className="flex items-center justify-center w-8 h-8 rounded-md
                                   bg-red-500 text-white
                                   hover:bg-red-700
                                   active:scale-90
                                   transition-all duration-150"
                    >
                        <FaTrash size={14} />
                    </button>

                </div>
            ))}

            {/* Cart Summary */}
            <div className="mt-8 rounded-lg p-5 bg-white border border-gray-100 shadow-sm space-y-4">

                {/* Header */}
                <h2 className="text-lg font-semibold">
                    Cart Summary
                </h2>

                <div className="border-t"></div>

                {/* Items Count */}
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Items</span>
                    <span className="font-medium">{totalItems}</span>
                </div>

                {/* Total Price */}
                <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Total Amount</span>
                    <span className="text-xl font-bold text-green-600">
                        ${total.toFixed(2)}
                    </span>
                </div>

                <button
                    className="
                        w-full mt-2
                        py-2
                        rounded-md
                        bg-blue-600 text-white
                        font-medium
                        hover:bg-blue-700
                        active:scale-95
                        transition
                    "
                >
                    Proceed to Checkout
                </button>

            </div>
        </div>
    );
};

export default Cart;
