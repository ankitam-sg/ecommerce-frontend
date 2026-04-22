import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/productApi";
import type { Product } from "../types/product";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";

const Products = () => {

    // React Router navigation instance
    const navigate = useNavigate();

    // Custom hook → cart action (abstracted from Zustand)
    // + derived state for stock awareness (UI only)
    const { addItem, getRemainingQty } = useCart();

    // Fetch products using React Query
    const { data, isPending, isError, error } = useQuery<Product[]>({
        queryKey: ["products"],
        queryFn: getProducts,
    });

    // Navigate to Product Details Page
    const handleProductClick = (id: number) => {
        navigate(`/product/${id}`);
    };

    // Loading state
    if (isPending) return <Loader />;

    // Error state
    if (isError) {
        return <ErrorState msg={(error as Error).message} />;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-5 ">

            {/* Product cards list */}
            {data?.map((product) => {

                // Remaining quantity for each product (derived → UI only)
                const remaining = getRemainingQty(product.id);

                // Single source of truth for stock state (UI layer)
                const isOutOfStock = remaining <= 0;

                return (
                    <div 
                        key={product.id} 
                        onClick={() => handleProductClick(product.id)}
                        className="
                            border p-4 rounded-lg
                            cursor-pointer
                            hover:shadow-lg hover:scale-[1.02]
                            transition flex flex-col justify-between
                        "
                    >

                        {/* Product image */}
                        <img
                            src={product.image}
                            alt={product.title}
                            className="h-40 object-contain mx-auto"
                        />

                        {/* Product info */}
                        <div className="mt-3">

                            {/* Title */}
                            <h2 className="text-sm font-semibold line-clamp-2">
                                {product.title}
                            </h2>

                            {/* Price */}
                            <p className="text-lg font-bold mt-1">
                                ${product.price}
                            </p>

                            {/* Stock status (UI feedback only) */}
                            {isOutOfStock && (
                                <p className="text-red-500 text-xs mt-1">
                                    Out of Stock
                                </p>
                            )}

                        </div>

                        {/* Add to cart button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // prevent navigation

                                // No guard here → store enforces rules
                                addItem(product, 1);
                            }}
                            title="Add to cart"
                            disabled={isOutOfStock} // UI prevents invalid interaction
                            className="
                                mt-3 w-full
                                px-4 py-2
                                rounded-md
                                text-sm font-medium
                                bg-blue-600 text-white
                                transition
                                enabled:hover:bg-blue-800
                                enabled:active:scale-95
                                disabled:opacity-50 disabled:cursor-not-allowed
                            "
                        >
                            Add to Cart
                        </button>

                    </div>
                );
            })}
        </div>
    );
};

export default Products;
