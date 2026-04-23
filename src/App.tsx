import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";

import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Toast from "./components/Toast";

function App() {
    return (
        <BrowserRouter>

            {/* Global UI layer (not tied to routing) */}
            <Toast />

            <Routes>

                {/* Layout wrapper route */}
                <Route path="/" element={<Layout />}>

                    {/* default redirect */}
                    <Route index element={<Navigate to="/products" />} />

                    <Route path="products" element={<Products />} />
                    <Route path="product/:id" element={<ProductDetails />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="checkout" element={<Checkout />} />
                    
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;
