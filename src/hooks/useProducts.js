import { useState, useEffect } from "react";
import { useToast } from "../context/ToastContext"
import { 
  getProductsRequest, 
  createProductRequest, 
  updateProductRequest, 
  deleteProductRequest 
} from "../api/product/product_routes";

const LIMIT = 10;

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [page, setPage]         = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const toast = useToast();

  const loadProducts = async (p = page) => {
    const res = await getProductsRequest(p, LIMIT);
    setProducts(res.data.data);
    setTotalPages(Math.ceil(res.data.total / LIMIT));
  };

  useEffect(() => { loadProducts(); }, [page]);

  const createProduct = async (data) => {
    try {
      await createProductRequest(data);
      await loadProducts();
      toast.success("Producto creado exitosamente");
    } catch (error) {
      const message = error.response?.data?.detail || "Ocurrió un error al crear el producto";
      toast.error(message);
    }
  }

  const updateProduct = async (id, data) => {
    try {
      await updateProductRequest(id, data);
      await loadProducts();
      toast.success("Producto actualizado exitosamente");
    } catch (error) {
      const message = error.response?.data?.detail || "Ocurrió un error al actualizar el producto";
      toast.error(message);
    }
  }

  const deleteProduct = async (id) => {
    try {
      await deleteProductRequest(id);
      await loadProducts();
      toast.success("Producto eliminado exitosamente");
    } catch (error) {
      const message = error.response?.data?.detail || "Ocurrió un error al eliminar el producto";
      toast.error(message);
    }
  }

  return { products, page, totalPages, setPage, createProduct, updateProduct, deleteProduct };
}