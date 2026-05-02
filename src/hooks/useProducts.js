import { useState, useEffect } from "react";
import { useToast } from "../context/ToastContext"
import { InventoryReportPDF } from "../components/pdf/InventoryReportPDF"
import { 
  getProductsRequest,
  getInventoryReportRequest, 
  createProductRequest, 
  updateProductRequest, 
  deleteProductRequest 
} from "../api/product/product_routes";

const LIMIT = 10;

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [page, setPage]         = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters]       = useState({});
  const toast = useToast();

  const loadProducts = async (p = page, f = filters) => {
    const res = await getProductsRequest(p, LIMIT, f);
    setProducts(res.data.data);
    setTotalPages(Math.ceil(res.data.total / LIMIT));
  };

  useEffect(() => { loadProducts(); }, [page, filters]);

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const exportPDF = async () => {
    try {
      const res = await getInventoryReportRequest(filters);
      const blob = await InventoryReportPDF(res.data);
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventario_${new Date().toISOString().split('T')[0]}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Error al generar el reporte PDF");
    }
  };

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

  return { products, page, totalPages, setPage, applyFilters, exportPDF, createProduct, updateProduct, deleteProduct };
}