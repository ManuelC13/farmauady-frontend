import { api } from "../axios";

export const getCategoriesRequest = () =>
    api.get("/categories");

export const createCategoryRequest = (data) =>
    api.post("/categories", data);

export const updateCategoryRequest = (id, data) =>
    api.put(`/categories/${id}`, data);

export const deleteCategoryRequest = (id) =>
    api.delete(`/categories/${id}`);