import { api } from "../axios";

// Para el dropdown — sin paginación
export const getAllCategoriesRequest = () =>
    api.get("/categories/");

// Para la tabla — con paginación
export const getCategoriesRequest = (page = 1, limit = 10) =>
    api.get("/categories/", { params: { page, limit } });

export const createCategoryRequest = (data) =>
    api.post("/categories/", data);

export const updateCategoryRequest = (id, data) =>
    api.put(`/categories/${id}`, data);

export const deleteCategoryRequest = (id) =>
    api.delete(`/categories/${id}`);