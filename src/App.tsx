import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";

import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    {/* Default Route */}
                    <Route path="*" element={<Navigate to="/products" />} />
                    
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
