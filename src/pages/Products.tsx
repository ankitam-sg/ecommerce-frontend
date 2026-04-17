import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/productApi";
import type { Product } from "../types/product";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";

const Products = () => {

    // Fetch products using React Query
    const { data, isPending, isError, error } = useQuery<Product[]>({
        queryKey: ["products"],     // cache key
        queryFn: getProducts,        // API call
    });

    // Show loader while fetching
    if (isPending) return <Loader />;

    // Show error UI if request fails
    if (isError) {
        return <ErrorState msg={(error as Error).message} />;
    }

    return (
        <div className="grid grid-cols-4 gap-4 p-4">

            {/* Render product cards */}
            {data?.map((product) => (
                <div key={product.id} className="border p-4 rounded">

                    {/* Product image */}
                    <img
                        src={product.image}
                        alt={product.title}
                        className="h-40 object-contain"
                    />

                    {/* Title */}
                    <h2 className="text-sm font-semibold mt-2">
                        {product.title}
                    </h2>

                    {/* Price */}
                    <p className="text-lg font-bold">
                        ${product.price}
                    </p>

                </div>
            ))}
        </div>
    );
};

export default Products;
