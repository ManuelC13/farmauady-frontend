import { useState, useEffect, useRef, useCallback } from "react";
import { getSaleProductsRequest } from "../../api/product/product_routes";

export function useProductCatalog(cartSessionId, initialSearch = "") {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(initialSearch);
  const [loading, setLoading] = useState(true);
  const searchRef = useRef(search);

  const fetchProducts = useCallback(async (searchTerm = "", isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const response = await getSaleProductsRequest(searchTerm, cartSessionId, true);
      const pList = Array.isArray(response.data)
        ? response.data
        : response.data?.data || response.data?.products || [];
      const mappedProducts = pList.map((p) => ({
        id: p.id_product,
        name: p.name,
        category: p.category_name,
        price: parseFloat(p.sale_price),
        stock: p.stock,
      }));
      setProducts(mappedProducts);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [cartSessionId]);

  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  useEffect(() => {
    fetchProducts(search);
  }, [search]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchProducts(value);
  };

  return {
    products,
    search,
    loading,
    handleSearchChange,
    fetchProducts,
    searchRef,
  };
}
