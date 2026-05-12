import { useState, useEffect } from "react";
import { useToast } from "../context/ToastContext";
import {
    getCategoriesRequest,
    createCategoryRequest,
    updateCategoryRequest,
    deleteCategoryRequest,
} from "../api/product/category_routes";

const LIMIT = 10;

export function useCategories() {
    const [categories, setCategories] = useState([]);
    const [page, setPage]             = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch]         = useState("");
    const toast = useToast();

    const loadCategories = async (p = page, s = search) => {
        const res = await getCategoriesRequest(p, LIMIT, s);
        setCategories(res.data.data);
        setTotalPages(Math.ceil(res.data.total / LIMIT));
    };

    useEffect(() => { loadCategories(); }, [page, search]);

    const applySearch = (term) => {
        setSearch(term);
        setPage(1);
    };

    const createCategory = async (data) => {
        try {
            await createCategoryRequest(data);
            await loadCategories();
            toast.success("Categoría creada exitosamente");
        } catch (error) {
            toast.error(error.response?.data?.detail || "Error al crear la categoría");
        }
    };

    const updateCategory = async (id, data) => {
        try {
            await updateCategoryRequest(id, data);
            await loadCategories();
            toast.success("Categoría actualizada exitosamente");
        } catch (error) {
            toast.error(error.response?.data?.detail || "Error al actualizar la categoría");
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

    return { categories, page, totalPages, setPage, applySearch, createCategory, updateCategory, deleteCategory };
}