import { api } from "../axios";

export const getProductsRequest = () =>
    api.get("/products");

export const getProductRequest = (id) =>
    api.get(`/products/${id}`);

export const createProductRequest = (product) =>
    api.post("/products", product);

export const updateProductRequest = (id, product) =>
    api.put(`/products/${id}`, product);

export const deleteProductRequest = (id) =>
    api.delete(`/products/${id}`);