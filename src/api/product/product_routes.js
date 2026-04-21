import { api } from "../axios";

//Para Nueva Venta (catálogo con búsqueda)
export const getSaleProductsRequest = (search = "") =>
    api.get("/products/sale", { params: { search } });

export const getProductsRequest = () =>
    api.get("/products");

export const getCategoriesRequest = () =>
    api.get("/categories");

export const getProductRequest = (id) =>
    api.get(`/products/${id}`);

export const createProductRequest = (product) =>
    api.post("/products", product);

export const updateProductRequest = (id, product) =>
    api.put(`/products/${id}`, product);

export const deleteProductRequest = (id) =>
    api.delete(`/products/${id}`);
