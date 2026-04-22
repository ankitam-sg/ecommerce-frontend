import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import type { Product } from "../types/product";
import { getProductById } from "../api/productApi";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import { useCart } from "../hooks/useCart";
import { useState } from "react";

const ProductDetails = () => {

    // Get Product ID from URL (/product/:id)
    const { id } = useParams();

    // Convert ID safely to number
    const productId = Number(id);

    // React Query Client (for cache access)
    const queryClient = useQueryClient();

    // Local Quantity State (UI only)
    const [qty, setQty] = useState(1);

    // Cart Hook (actions + derived state)
    const { addItem, getRemainingQty } = useCart();

    // Try to get product from existing cache first
    const cachedProduct = queryClient
        .getQueryData<Product[]>(["products"])
        ?.find((p) => p.id === productId);

    // Fetch product only if not in cache + valid ID
    const {
        data: product,
        isPending,
        isError,
        error,
    } = useQuery<Product>({
        queryKey: ["product", productId],
        queryFn: () => getProductById(productId),
        enabled: !!productId && !cachedProduct,
        initialData: cachedProduct,
    });

    // Handle invalid ID AFTER hooks (prevents hook rule violation)
    if (!productId) {
        return <ErrorState msg="Invalid product ID" />;
    }

    // Loading state
    if (isPending) return <Loader />;

    // Error state
    if (isError) {
        return <ErrorState msg={(error as Error).message} />;
    }

    // Safety guard (prevents crash if no data)
    if (!product) return null;

    // Remaining quantity for this product
    const remaining = getRemainingQty(product.id);

    // Single source of truth for stock state (UI only)
    const isOutOfStock = remaining <= 0;

    // Add to Cart handler (interaction flow only, NOT safety layer)
    const handleAddToCart = () => {
        addItem(product, qty);   // Store enforces actual constraints
        setQty(1);
    };

    return (
        <div className="max-w-5xl mx-auto p-6">

            {/* Layout: Image + Details */}
            <div className="grid md:grid-cols-2 gap-8 items-start">

                {/* Product Image */}
                <div className="border rounded-lg p-4 flex justify-center items-center">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="h-80 object-contain"
                    />
                </div>

                {/* Product Info */}
                <div className="flex flex-col">

                    {/* Title */}
                    <h1 className="text-2xl font-bold">
                        {product.title}
                    </h1>

                    {/* Category */}
                    <p className="text-sm text-gray-500 mt-2">
                        Category: {product.category}
                    </p>

                    {/* Price */}
                    <p className="text-xl text-green-600 font-semibold mt-4">
                        ${product.price}
                    </p>

                    {/* Description */}
                    <p className="mt-4 text-gray-700 leading-relaxed">
                        {product.description}
                    </p>

                    {/* Rating */}
                    <div className="mt-4 text-sm">
                        ⭐ {product.rating.rate} / 5 ({product.rating.count} reviews)
                    </div>

                    {/* Quantity Selector */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium mb-1">
                            Quantity
                        </label>

                        {isOutOfStock ? (
                            <p className="text-red-500 text-sm">
                                Out of Stock
                            </p>
                        ) : (
                            <select
                                value={qty}
                                onChange={(e) => setQty(Number(e.target.value))}
                                className="border rounded-md px-3 py-2"
                            >
                                {Array.from({ length: remaining }, (_, i) => i + 1).map((num) => (
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Add to Cart Button */}
                    <div className="mt-6">
                        <button
                            onClick={handleAddToCart}
                            disabled={isOutOfStock} // UI responsibility only
                            className="
                                px-6 py-2 rounded-md text-sm font-medium
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

                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
