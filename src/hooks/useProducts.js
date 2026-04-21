import { useState, useEffect } from "react";
import { getProductsRequest, createProductRequest, updateProductRequest, deleteProductRequest } from "../api/product/product_routes";

export function useProducts() {
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    const res = await getProductsRequest();
    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const createProduct = async (data) => {
    await createProductRequest(data);
    await loadProducts();
  };

  const updateProduct = async (id, data) => {
    await updateProductRequest(id, data);
    await loadProducts();
  };

  const deleteProduct = async (id) => {
    await deleteProductRequest(id);
    await loadProducts();
  };

  return { products, createProduct, updateProduct, deleteProduct };
}