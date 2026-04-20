import { useCartStore } from "../store/cartStore";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

const Cart = () => {

    // Zustand state & actions
    const cartItems = useCartStore((state) => state.cartItems);
    const incQty = useCartStore((state) => state.incQty);
    const decQty = useCartStore((state) => state.decQty);
    const removeItem = useCartStore((state) => state.removeItem);

    // Total price (derived state - recalculated on every render)
    const total = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    // Total number of items (derived state)
    const totalItems = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

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

                        {/* Subtotal per item (derived) */}
                        <p className="text-sm text-gray-500 mt-1">
                            Subtotal: ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">

                        {/* Decrease */}
                        <button
                            onClick={() => decQty(item.id)}
                            title="Decrease Quantity"
                            className="flex items-center justify-center w-8 h-8 rounded-md 
                                       bg-gray-200 text-gray-800
                                       hover:border-gray-700
                                       active:scale-90
                                       transition-all duration-150"
                        >
                            <FaMinus size={12} />
                        </button>

                        {/* Quantity Display */}
                        <div className="flex items-center justify-center w-10 h-8 rounded-md
                                        bg-white text-gray-900 font-medium
                                        border border-gray-400">
                            {item.quantity}
                        </div>

                        {/* Increase */}
                        <button
                            onClick={() => incQty(item.id)}
                            title="Increase Quantity"
                            className="flex items-center justify-center w-8 h-8 rounded-md 
                                       bg-gray-200 text-gray-800
                                       hover:border-gray-700
                                       active:scale-90
                                       transition-all duration-150"
                        >
                            <FaPlus size={12} />
                        </button>
                    </div>

                    {/* Remove Item */}
                    <button
                        onClick={() => removeItem(item.id)}
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

            {/* Cart Summary (Checkout Style Block) */}
            <div className="mt-8 rounded-lg p-5 bg-white border border-gray-100 shadow-sm space-y-4">

                {/* Header */}
                <h2 className="text-lg font-semibold">
                    Cart Summary
                </h2>

                {/* Divider */}
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

                {/* Checkout Button (UI only for now) */}
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
