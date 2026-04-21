import { useState, useEffect } from "react";
import { getCategoriesRequest } from "../api/product/category_routes";

export function useCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await getCategoriesRequest();
      setCategories(res.data);
    };
    load();
  }, []);

  return { categories };
}