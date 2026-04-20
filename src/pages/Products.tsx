import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/productApi";
import type { Product } from "../types/product";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";

const Products = () => {

    // React Router navigation instance
    const navigate = useNavigate();

    // Zustand → Get addItem action ONCE (not inside loop)
    const addItem = useCartStore((state) => state.addItem);

    // Fetch products using React Query
    const { data, isPending, isError, error } = useQuery<Product[]>({
        queryKey: ["products"],     // cache key for product list
        queryFn: getProducts,        // API call
    });

    // Navigate to Product Details Page
    const handleProductClick = (id: number) => {
        navigate(`/product/${id}`);
    }

    // Show loader while fetching
    if (isPending) return <Loader />;

    // Show error UI if request fails
    if (isError) {
        return <ErrorState msg={(error as Error).message} />;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-5">

            {/* Render product cards */}
            {data?.map((product) => (
                <div 
                    key={product.id} 
                    onClick={() => handleProductClick(product.id)}      // Whole Card is clickable
                    className="border p-4 rounded-lg cursor-pointer hover:shadow-lg hover:scale-[1.02] transition flex flex-col justify-between"
                >

                    {/* Product image */}
                    <img
                        src={product.image}
                        alt={product.title}
                        className="h-40 object-contain mx-auto"
                    />

                    {/* Info Section (grouping title + price for structure) */}
                    <div className="mt-3">
                        {/* Title */}
                        <h2 className="text-sm font-semibold line-clamp-2">
                            {product.title}
                        </h2>

                        {/* Price */}
                        <p className="text-lg font-bold mt-1">
                            ${product.price}
                        </p>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();        // Prevent Card click (Navigation) 
                            addItem(product, 1);           // Add to Cart (with Default Quantity)
                        }}
                        title="Add to cart"
                        className="
                            mt-3 w-full
                            px-4 py-2
                            rounded-md
                            text-sm font-medium
                            bg-blue-600 text-white
                            hover:bg-blue-800
                            active:scale-95
                            transition
                        "
                    >
                        Add to Cart
                    </button>

                </div>
            ))}
        </div>
    );
};

export default Products;
