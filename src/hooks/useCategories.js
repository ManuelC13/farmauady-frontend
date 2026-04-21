import { useState, useEffect } from "react";
import { useToast } from "../context/ToastContext"
import {
    getCategoriesRequest,
    createCategoryRequest,
    updateCategoryRequest,
    deleteCategoryRequest,
} from "../api/product/category_routes";

export function useCategories() {
    const [categories, setCategories] = useState([]);
    const toast = useToast();

    const loadCategories = async () => {
        const res = await getCategoriesRequest();
        setCategories(res.data);
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const createCategory = async (data) => {
        try {
            await createCategoryRequest(data);
            await loadCategories();
            toast.success("Categoría creada exitosamente");
        } catch (error) {
            const message = error.response?.data?.detail || "Error al crear la categoría";
            toast.error(message);
        }
    };

    const updateCategory = async (id, data) => {
        try {
            await updateCategoryRequest(id, data);
            await loadCategories();
            toast.success("Categoría actualizada exitosamente");
        } catch (error) {
            const message = error.response?.data?.detail || "Error al actualizar la categoría";
            toast.error(message);
        }
    };

    const deleteCategory = async (id) => {
        try {
            await deleteCategoryRequest(id);
            await loadCategories();
            toast.success("Categoría desactivada exitosamente");
        } catch (error) {
            const message = error.response?.data?.detail || "Error al desactivar la categoría";
            toast.warning(message);
        }
    };

    return { categories, createCategory, updateCategory, deleteCategory };
}