import axios from "axios";

// Creating a reusable axios instance
const api = axios.create({
    baseURL: "https://fakestoreapi.com",
})

// Fetch All Products
export const getProducts = async () => {
    const res = await api.get("/products")
    return res.data
}

// Fetch Single Product
export const getProductById= async (id: number) => {
    const res = await api.get(`/products/${id}`)
    return res.data
}