import { api } from "../axios";

// Para el dropdown — sin paginación
export const getAllCategoriesRequest = () =>
    api.get("/categories/");

export const getAllActiveCategoriesRequest = () =>
    api.get("/categories/all-active");

// Para la tabla — con paginación
export const getCategoriesRequest = (page = 1, limit = 10, search = "") =>
    api.get("/categories/", { params: { page, limit, ...(search && { search }) } });

export const createCategoryRequest = (data) =>
    api.post("/categories/", data);

export const updateCategoryRequest = (id, data) =>
    api.put(`/categories/${id}`, data);

export const deleteCategoryRequest = (id) =>
    api.delete(`/categories/${id}`);