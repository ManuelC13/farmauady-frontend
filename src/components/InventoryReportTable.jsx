import { useEffect, useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { getInventoryReportRequest } from "../api/product/product_routes"
import { useToast } from "../context/ToastContext";
import { InventoryReportPDF } from "../components/pdf/InventoryReportPDF";

function InventoryReportTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getInventoryReportRequest();
        setProducts(data);
      } catch {
        toast.error("Error al cargar el reporte de inventario");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const getStockStatus = (stock, minimum_stock) => {
    if (stock <= minimum_stock) {
      return (
        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-600 text-xs font-semibold">
          Stock crítico
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-semibold">
        Disponible
      </span>
    );
  };

  const handleExport = async () => {
    const blob = await InventoryReportPDF(products);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventario_${new Date().toISOString().split('T')[0]}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="bg-primary px-6 py-4 flex items-center justify-between">
        <h2 className="text-white text-lg font-bold">Reporte de estado del inventario</h2>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg border border-white/30 hover:bg-white/20 transition cursor-pointer"
        >
          <FileDown size={18} /> Exportar PDF
        </button>
      </div>

      {/* Descripción */}
      <div className="bg-white px-6 py-3 border-b border-gray-100">
        <p className="text-xs text-gray-400">
          Muestra los productos disponibles, sus existencias actuales y alertas para aquellos con nivel crítico (≤ stock mínimo).
        </p>
      </div>

      {/* Tabla */}
      <div className="bg-white overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-3 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Medicamento</th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Categoría</th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Existencia</th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="4" className="py-10 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Loader2 className="animate-spin text-blue-500" size={28} />
                    <span className="text-sm">Cargando inventario...</span>
                  </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-10 text-center text-sm text-gray-400 italic">
                  No hay productos registrados
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id_product} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-sm font-medium text-gray-800">{product.name}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{product.category?.name}</td>
                  <td className="py-4 px-6 text-sm font-bold text-gray-800">{product.stock}</td>
                  <td className="py-4 px-6">{getStockStatus(product.stock, product.minimum_stock)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryReportTable;