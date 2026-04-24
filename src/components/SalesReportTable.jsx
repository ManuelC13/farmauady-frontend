import { useEffect, useState } from "react";
import { FileDown, Loader2, Info } from "lucide-react";
import { getFilteredSalesRequest } from "../api/sales/sales_routes";
import { SalesReportPDF } from "../components/pdf/SalesReportPDF";
import { useToast } from "../context/ToastContext";
import { useUsers } from "../hooks/useUsers";
import { useCategories } from "../hooks/useCategories";

function SalesReportTable({
  startDate, endDate, sellerId, categoryId, appliedFilters,
  onStartDateChange, onEndDateChange, onSellerChange, onCategoryChange, onFilter,
}) {
  const [sales, setSales]     = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { users }      = useUsers();
  const { categories } = useCategories();

  // Solo vendedores en el dropdown
  const sellers = users.filter((u) => u.role?.name === "Vendedor");

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const params = {
          start_date:  appliedFilters.start_date,
          end_date:    appliedFilters.end_date,
          ...(appliedFilters.seller_id   && { seller_id:   appliedFilters.seller_id }),
          ...(appliedFilters.category_id && { category_id: appliedFilters.category_id }),
        };
        const { data } = await getFilteredSalesRequest(params);
        setSales(data);
      } catch {
        toast.error("Error al cargar el reporte de ventas");
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, [appliedFilters]);

  const handleExport = async () => {
    const blob = await SalesReportPDF(sales, appliedFilters);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ventas_${appliedFilters.start_date}_${appliedFilters.end_date}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputBase = "border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white";

  return (
    <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="bg-primary px-6 py-4 flex items-center justify-between">
        <h2 className="text-white text-lg font-bold">Reporte de ventas por período</h2>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg border border-white/30 hover:bg-white/20 transition cursor-pointer"
        >
          <FileDown size={18} /> Exportar PDF
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white px-6 py-5 border-b border-gray-100">
        <div className="flex flex-wrap items-end gap-4">

          {/* Fecha inicio */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Fecha de inicio</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className={inputBase}
            />
          </div>

          {/* Fecha fin */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Fecha de fin</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className={inputBase}
            />
          </div>

          {/* Vendedor */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Vendedor</label>
            <select
              value={sellerId}
              onChange={(e) => onSellerChange(e.target.value)}
              className={`${inputBase} min-w-[160px]`}
            >
              <option value="">Todos</option>
              {sellers.map((s) => (
                <option key={s.id_user} value={s.id_user}>
                  {s.first_name} {s.last_name}
                </option>
              ))}
            </select>
          </div>

          {/* Categoría */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Categorías</label>
            <select
              value={categoryId}
              onChange={(e) => onCategoryChange(e.target.value)}
              className={`${inputBase} min-w-[160px]`}
            >
              <option value="">Todas</option>
              {categories.map((c) => (
                <option key={c.id_category} value={c.id_category}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Botón filtrar */}
          <button
            onClick={onFilter}
            className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-secondary transition cursor-pointer"
          >
            Filtrar
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-3 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">ID Ticket</th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Fecha/hora</th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Vendedor</th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="4" className="py-10 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Loader2 className="animate-spin text-blue-500" size={28} />
                    <span className="text-sm">Cargando ventas...</span>
                  </div>
                </td>
              </tr>
            ) : sales.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-10 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Info size={28} className="text-gray-300" />
                    <span className="text-sm italic">No hay ventas en el periodo seleccionado</span>
                  </div>
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.id_sale} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-sm font-bold text-gray-800">{sale.folio}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {new Date(sale.sale_date).toLocaleString("es-MX", {
                      day: "2-digit", month: "2-digit", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700 font-medium">{sale.seller_name}</td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-sm font-semibold">
                      ${parseFloat(sale.total).toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalesReportTable;