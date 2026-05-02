import { useState, useEffect } from "react";
import { getAllCategoriesRequest } from "../api/product/category_routes";

export function useCategoriesAll() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const load = async () => {
            const res = await getAllCategoriesRequest();
            setCategories(res.data.data);
        };
        load();
    }, []);

    return { categories };
}