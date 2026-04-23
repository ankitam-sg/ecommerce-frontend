import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { 
    FaStore, 
    FaShoppingBag, 
    FaUser,
    FaSignOutAlt  
} from "react-icons/fa";

const Navbar = () => {

    // total cart items from global cart hook
    const { totalItems } = useCart();

    // auth state + logout action
    const { currentUser, logoutUser } = useAuth();

    // derived username safely
    const username = currentUser?.email?.split("@")[0];

    return (
        <nav className="
            flex items-center justify-between
            px-6 py-4
            bg-gray-800 text-white
            sticky top-0 z-50
        ">

            {/* LEFT - Logo */}
            <h1 className="font-bold text-lg">
                E-Commerce
            </h1>

            {/* CENTER - Greeting */}
            <div className="flex-1 flex justify-center">
                {currentUser && (
                    <span className="text-lg font-semibold tracking-wide">
                        Hi, {username}
                    </span>
                )}
            </div>

            {/* RIGHT - Actions */}
            <div className="flex items-center gap-6">

                {/* Logged in UI */}
                {currentUser ? (
                    <>
                        {/* Products */}
                        <Link to="/products" title="Products">
                            <FaStore size={23} />
                        </Link>

                        {/* Cart */}
                        <Link to="/cart" title="Cart" className="relative">
                            <FaShoppingBag size={23} />

                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-3 bg-red-500 text-xs px-1.5 py-0.5 rounded-full">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {/* Logout */}
                        <button onClick={logoutUser} title="Logout">
                            <FaSignOutAlt size={23} />
                        </button>
                    </>
                ) : (
                    /* Guest UI */
                    <Link to="/login" title="Login">
                        <FaUser size={23} />
                    </Link>
                )}

            </div>
        </nav>
    );
};


export default Navbar;
