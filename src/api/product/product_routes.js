import { api } from "../axios";

//Para Nueva Venta (catálogo con búsqueda)
export const getSaleProductsRequest = (search = "") =>
    api.get("/products/sale", { params: { search } });

export const getProductsRequest = (page = 1, limit = 10) =>
    api.get("/products/", { params: { page, limit } });

export const getCategoriesRequest = () =>
    api.get("/categories/");

export const getProductRequest = (id) =>
    api.get(`/products/${id}`);

export const createProductRequest = (product) =>
    api.post("/products/", product);

export const updateProductRequest = (id, product) =>
    api.put(`/products/${id}`, product);

export const deleteProductRequest = (id) =>
    api.delete(`/products/${id}`);

export const getInventoryReportRequest = () =>
    api.get("/products/inventory-report");
