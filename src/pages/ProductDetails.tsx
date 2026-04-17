import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import type { Product } from "../types/product";
import { getProductById } from "../api/productApi";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";

const ProductDetails = () => {

    // Get Product ID from URL (/product/:id)
    const { id } = useParams();

    // React Query Client Instance (for Cache Access)
    const queryClient = useQueryClient();

    // Convert ID safely to Number
    const productId = Number(id);

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
        enabled: !cachedProduct && !!productId,         // IMP: Skip fetch if Cache exists
        initialData: cachedProduct,                                 // Reuse Cache if available
    });

     // Loading state
    if (isPending) return <Loader />;

    // Error state
    if (isError) {
        return <ErrorState msg={(error as Error).message} />;
    }

    if (!product) return null;
    
    return (
        <div className="max-w-3xl mx-auto p-6">

            {/* Product Image */}
            <img 
                src={product.image}
                alt={product.title}
                className="h-80 object-contain mt-4"
            />

            {/* Title */}
            <h1 className="text-2xl font-bold mt-4">
                {product.title}
            </h1>

            {/* Price */}
            <p className="text-xl text-green-600 font-semibold mt-2">
                {product.price}
            </p>

            {/* Category */}
            <p className="text-sm text-gray-500 mt-1">
                Category: {product.category}
            </p>

            {/* Description */}
            <p className="mt-4 text-gray-700">
                {product.description}
            </p>

            {/* Rating */}
            <div className="mt-4 text-sm">
                ⭐ {product.rating.rate} / 5 ({product.rating.count} reviews)
            </div>
        </div>
    );
};

export default ProductDetails;
