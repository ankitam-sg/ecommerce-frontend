import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import type { Product } from "../types/product";
import { getProductById } from "../api/productApi";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import { useCartStore } from "../store/cartStore";
import { useState } from "react";

const ProductDetails = () => {

    // Get Product ID from URL (/product/:id)
    const { id } = useParams();

    // React Query Client Instance (for Cache Access)
    const queryClient = useQueryClient();

    // Convert ID safely to Number
    const productId = Number(id);

    // Local Quantity State - default 1 (frontend only, No backend) 
    const [qty, setQty] = useState(1);

    // Max Quantity Limit (Hardcoded Business Rule)
    const MAX_QTY = 10;

    // 1. Try to get Product from existing Products Cache    
    const cachedProduct = queryClient
        .getQueryData<Product[]>(["products"])
        ?.find((p) => p.id === productId);

    // 2. Fetch Single Product ONLY if not found in QueryCache
    const {
        data: product,
        isPending,
        isError,
        error,
    } = useQuery<Product>({
        queryKey: ["product", productId],
        queryFn: () => getProductById(productId),
        enabled: !cachedProduct && !!productId,
        initialData: cachedProduct,
    });

    // To Add Product to Cart (Zustand)
    const addItem = useCartStore((state) => state.addItem);

    // Loading state
    if (isPending) return <Loader />;

    // Error state
    if (isError) {
        return <ErrorState msg={(error as Error).message} />;
    }

    if (!product) return null;

    // Add to Cart Handler
    const handleAddToCart = () => {
        addItem(product, qty);
        setQty(1);                          // Reset after adding item
    }

    return (
        <div className="max-w-5xl mx-auto p-6">

            {/* Layout split: image + details */}
            <div className="grid md:grid-cols-2 gap-8 items-start">

                {/* LEFT: Product Image */}
                <div className="border rounded-lg p-4 flex justify-center items-center">
                    <img 
                        src={product.image}
                        alt={product.title}
                        className="h-80 object-contain"
                    />
                </div>

                {/* RIGHT: Product Info */}
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

                    {/* Quantity DropDown */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium mb-1">
                            Quantity
                        </label>

                        <select
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                            className="border rounded-md px-3 py-2"
                        >
                            {Array.from({ length: MAX_QTY}, (_, i) => i + 1).map((num) => (
                                <option key={num} value={num}>
                                    {num}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Add to Cart */}
                    <div className="mt-6">
                        <button
                            onClick={handleAddToCart}
                            className="
                                px-6 py-2
                                rounded-md
                                text-sm font-medium
                                bg-blue-600
                                text-white
                                hover:bg-blue-800
                                active:scale-95
                                transition
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
