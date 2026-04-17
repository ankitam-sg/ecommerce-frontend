import { Link } from "react-router-dom"

const Navbar = () => {
    return (
        <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <h1>E-Commerce</h1>

            <div>
                <Link to="/products">Products</Link>
                <Link to="/cart">Cart</Link>
                <Link to="/login">Login</Link>
            </div>
        </nav>
    )
}

export default Navbar