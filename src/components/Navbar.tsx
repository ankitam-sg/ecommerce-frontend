import { Link } from "react-router-dom"
import { useCartStore } from "../store/cartStore"
import { FaStore, FaShoppingBag, FaUser } from "react-icons/fa";

const Navbar = () => {
   // Get total quantity directly from Zustand store
    const totalQty = useCartStore(
        (state) =>
            state.cartItems.reduce(
                (sum, item) => sum + item.quantity,
                0
            )
    );

    return (
        <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
            {/* Logo */}
            <h1 className="font-bold text-lg">
                E-Commerce
            </h1>

            {/* Links */}
            <div className="flex items-center gap-6">

                {/* Products */}
                <Link 
                    to="/products"
                    title="Products"
                    className="hover:text-gray-300 transition"
                >
                    <FaStore size={23}/>
                </Link>

                {/* Cart */}
                <Link 
                    to="/cart"
                    title="Cart"
                    className="relative hover:text-gray-300 transition"
                >
                    <FaShoppingBag size={23} />

                    {/* Badge */}
                    {totalQty > 0 && (
                        <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                            {totalQty}
                        </span>
                    )}
                </Link>

                {/* Login */}
                <Link 
                    to="/login"
                    title="Login"
                    className="hover:text-gray-300 transition"
                >
                    <FaUser size={23} />
                </Link>

            </div>
        </nav>
    );
};

export default Navbar;