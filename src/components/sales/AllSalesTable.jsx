import { Printer, Banknote, CreditCard, Loader2, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { getAllSalesAdminRequest } from "../../api/sales/sales_routes";
import { useToast } from "../../context/ToastContext";
import Pagination from "../layout/Pagination";

const LIMIT = 10;

function AllSalesTable({ searchTerm = "", timeFilter = "" }) {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const toast = useToast();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const { data } = await getAllSalesAdminRequest(page, LIMIT);
        const mapped = data.data.map((sale) => ({
          id: sale.folio,
          rawDate:  new Date(sale.sale_date),
          datetime: new Date(sale.sale_date).toLocaleString("es-MX", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit",
          }),
          items:    sale.details.reduce((sum, item) => sum + item.quantity, 0),
          total:    parseFloat(sale.total).toFixed(2),
          method:   sale.payment_method
            ? sale.payment_method.charAt(0).toUpperCase() + sale.payment_method.slice(1)
            : "Efectivo",
          seller: sale.seller_name,
        }));
        setSales(mapped);
        setTotalPages(Math.ceil(data.total / LIMIT));
      } catch (error) {
        toast.error("Error al cargar el historial de ventas");
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [page]);

  const displaySales = sales.filter((sale) => {
    const query = searchTerm.toLowerCase().trim();

    // Filtrar por ID de venta o vendedor
    if (query && !sale.id.toLowerCase().includes(query) && !sale.seller.toLowerCase().includes(query)) {
      return false;
    }

    // Filtrar por fecha
    if (timeFilter && sale.rawDate) {
      const now = new Date();
      const msPerDay = 24 * 60 * 60 * 1000;

      switch (timeFilter) {
        case "Hoy":
          if (sale.rawDate.toDateString() !== now.toDateString()) return false;
          break;
        case "Esta semana":
          if (now - sale.rawDate > 7 * msPerDay) return false;
          break;
        case "Este mes":
          if (sale.rawDate.getMonth() !== now.getMonth() ||
              sale.rawDate.getFullYear() !== now.getFullYear()) return false;
          break;
        case "Este año":
          if (sale.rawDate.getFullYear() !== now.getFullYear()) return false;
          break;
        default:
          break;
      }
    }

    return true;
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#EDF5FF] sticky top-0 z-10 shadow-sm border-b border-blue-100">
              {["ID de venta", "Vendedor", "Fecha y hora", "Artículos", "Total", "Método de pago", "Acciones"].map((col) => (
                <th key={col} className="py-4 px-6 text-[#A0C4FF] font-semibold text-xs uppercase tracking-wider bg-[#EDF5FF]">
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin text-blue-500" size={32} />
                    <span className="text-sm font-medium">Cargando historial de ventas...</span>
                  </div>
                </td>
              </tr>
            ) : displaySales.length > 0 ? (
              displaySales.map((sale, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-5 px-6 text-sm font-bold text-gray-800">{sale.id}</td>
                  <td className="py-5 px-6 text-sm text-gray-700 font-medium">{sale.seller}</td>
                  <td className="py-5 px-6 text-sm text-gray-600 font-medium">{sale.datetime}</td>
                  <td className="py-5 px-6 text-sm text-gray-600 font-bold text-center">{sale.items}</td>
                  <td className="py-5 px-6 text-sm font-bold text-gray-800">${sale.total}</td>
                  <td className="py-5 px-6 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      {sale.method === "Efectivo" ? (
                        <Banknote size={18} className="text-gray-900" />
                      ) : (
                        <CreditCard size={18} className="text-gray-900" />
                      )}
                      <span className="font-medium">{sale.method}</span>
                    </div>
                  </td>
                  <td className="py-5 px-6 text-center">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors inline-flex items-center justify-center">
                      <Printer size={20} className="text-[#007BFF]" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-12 text-center text-gray-400 italic">
                  <div className="flex flex-col items-center gap-2">
                    <Info size={32} className="text-gray-300" />
                    <span className="text-sm font-medium">No hay ventas registradas</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

export default AllSalesTable;