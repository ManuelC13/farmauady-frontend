import { Printer, Banknote, CreditCard, Loader2, Info, Search, ListFilter, ChevronDown, FileDown } from "lucide-react";
import { useState, useEffect } from "react";
import { getAllSalesAdminRequest, getFilteredSalesRequest } from "../../api/sales/sales_routes";
import { useToast } from "../../context/ToastContext";
import { getSellersRequest } from "../../api/user/user_routes"
import Pagination from "../layout/Pagination";
import { SalesReportPDF } from "../pdf/SalesReportPDF";

const LIMIT = 10;

function AllSalesTable({ searchTerm = "", timeFilter = "" }) {
  const [sales, setSales]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [startDate, setStartDate]     = useState("");
  const [endDate, setEndDate]         = useState("");
  const [sellerId, setSellerId]       = useState("");
  const [appliedFilters, setAppliedFilters] = useState({});
  const toast = useToast();
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    const loadSellers = async () => {
      try {
        const { data } = await getSellersRequest();
        setSellers(data);
      } catch {
      }
    };
    loadSellers();
  }, []);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const { data } = await getAllSalesAdminRequest(page, LIMIT, appliedFilters);
        const mapped = data.data.map((sale) => ({
          id:      sale.folio,
          rawDate: new Date(sale.sale_date),
          datetime: new Date(sale.sale_date).toLocaleString("es-MX", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit",
          }),
          items:   sale.details.reduce((sum, item) => sum + item.quantity, 0),
          total:   parseFloat(sale.total).toFixed(2),
          method:  sale.payment_method
            ? sale.payment_method.charAt(0).toUpperCase() + sale.payment_method.slice(1)
            : "Efectivo",
          seller:  sale.seller_name,
          rawSale: sale,
        }));
        setSales(mapped);
        setTotalPages(Math.ceil(data.total / LIMIT));
      } catch {
        toast.error("Error al cargar el historial de ventas");
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, [page, appliedFilters]);

  const handleFilter = () => {
    const newFilters = {};
    if (startDate)  newFilters.start_date = startDate;
    if (endDate)    newFilters.end_date   = endDate;
    if (sellerId)   newFilters.seller_id  = sellerId;
    setAppliedFilters(newFilters);
    setPage(1);
  };

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setSellerId("");
    setAppliedFilters({});
    setPage(1);
  };

  const handleExportPDF = async () => {
    try {
      const params = {
        start_date:  appliedFilters.start_date  || "2000-01-01",
        end_date:    appliedFilters.end_date    || new Date().toISOString().split('T')[0],
        seller_id:   appliedFilters.seller_id   || undefined,
      };
      const { data } = await getFilteredSalesRequest(params);
      const blob = await SalesReportPDF(data, appliedFilters);
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ventas_${new Date().toISOString().split('T')[0]}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Error al generar el reporte PDF");
    }
  };

  const displaySales = sales.filter((sale) => {
    const query = searchTerm.toLowerCase().trim();
    if (query && !sale.id.toLowerCase().includes(query) && !sale.seller.toLowerCase().includes(query)) {
      return false;
    }
    return true;
  });

  const inputBase = "border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white";


  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">

      {/* Filtros */}
      <div className="flex flex-wrap items-end gap-4 px-6 py-4 border-b border-gray-100">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Fecha inicio</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputBase} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Fecha fin</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputBase} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Vendedor</label>
          <select value={sellerId} onChange={(e) => setSellerId(e.target.value)} className={`${inputBase} min-w-[160px]`}>
            <option value="">Todos</option>
            {sellers.map((s) => (
              <option key={s.id_user} value={s.id_user}>{s.first_name} {s.last_name}</option>
            ))}
          </select>
        </div>

        <button onClick={handleFilter} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-secondary transition cursor-pointer">
          <ListFilter size={16} className="inline mr-1" /> Filtrar
        </button>

        <button onClick={handleClearFilters} className="px-4 py-2 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition cursor-pointer">
          Limpiar
        </button>

        <button onClick={handleExportPDF} className="ml-auto px-4 py-2 border border-gray-300 bg-white text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition cursor-pointer flex items-center gap-2">
          <FileDown size={16} /> Exportar PDF
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#EDF5FF] border-b border-blue-100">
              {["ID de venta", "Vendedor", "Fecha y hora", "Artículos", "Total", "Método de pago", "Acciones"].map((col) => (
                <th key={col} className="py-4 px-6 text-[#A0C4FF] font-semibold text-xs uppercase tracking-wider">
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