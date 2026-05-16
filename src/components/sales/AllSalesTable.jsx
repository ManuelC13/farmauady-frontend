import { Printer, Banknote, CreditCard, Loader2, Info, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { getAllSalesAdminRequest, getFilteredSalesRequest } from "../../api/sales/sales_routes";
import { useToast } from "../../context/ToastContext";
import Pagination from "../layout/Pagination";
import { SalesReportPDF } from "../pdf/SalesReportPDF";
import SaleDetailModal from "../sales/SaleDetailModal";

import { generateTicketPDF } from "../pdf/TicketPDF";
import { parseUtcDate } from "../../utils/dateUtils";

const LIMIT = 10;

function AllSalesTable({ searchTerm = "", appliedFilters = {}, triggerExport = 0 }) {
  const [sales, setSales]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [selectedSale, setSelectedSale] = useState(null);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const toast = useToast();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const { data } = await getAllSalesAdminRequest(page, LIMIT, appliedFilters);
        const mapped = data.data.map((sale) => ({
          id:       sale.folio,
          rawDate:  parseUtcDate(sale.sale_date),
          datetime: parseUtcDate(sale.sale_date).toLocaleString("es-MX", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit",
          }),
          items:    sale.details.reduce((sum, item) => sum + item.quantity, 0),
          total:    parseFloat(sale.total).toFixed(2),
          method:   sale.payment_method
            ? sale.payment_method.charAt(0).toUpperCase() + sale.payment_method.slice(1)
            : "Efectivo",
          seller:   sale.seller_name,
          rawSale:  sale,
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

  // Resetear a página 1 cuando cambian los filtros
  useEffect(() => {
    setPage(1);
  }, [appliedFilters]);

  useEffect(() => {
    if (triggerExport === 0) return;
    handleExportPDF();
  }, [triggerExport]);

  const handleExportPDF = async () => {
    try {
      const params = {
        start_date: appliedFilters.start_date || "2000-01-01",
        end_date:   appliedFilters.end_date   || new Date().toISOString().split('T')[0],
        seller_id:  appliedFilters.seller_id  || undefined,
      };
      const { data } = await getFilteredSalesRequest(params);
      const salesArray = Array.isArray(data) ? data : data.data;
      const blob = await SalesReportPDF(salesArray, appliedFilters);
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ventas_${new Date().toISOString().split('T')[0]}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
      toast.error("Error al generar el reporte PDF");
    }
  };

  const handleDownloadTicket = async (sale) => {
    if (!sale.rawSale) {
      toast.error("No se encontraron los detalles de esta venta.");
      return;
    }
    try {
      const blob = await generateTicketPDF(sale.rawSale);
      if (!blob) throw new Error();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Ticket_${sale.id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`Ticket #${sale.id} descargado correctamente`);
    } catch {
      toast.error("No se pudo generar el ticket. Intenta de nuevo.");
    }
  };

  return (
    <>
    <div className="bg-background rounded-xl border border-gray-300 shadow flex flex-col">

      <div className="overflow-auto max-h-[500px] rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-lightBlue border-b border-blue-100 sticky top-0 z-10">
              {["ID de venta", "Vendedor", "Fecha y hora", "Artículos", "Total", "Método de pago", "Acciones"].map((col) => (
                <th key={col} className="py-4 px-6 text-titleBlue font-semibold text-xs uppercase tracking-wider">
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
            ) : sales.length > 0 ? (
              sales.map((sale, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-sm font-medium text-gray-800">{sale.id}</td>
                  <td className="py-4 px-6 text-sm text-gray-800 font-medium">{sale.seller}</td>
                  <td className="py-4 px-6 text-sm text-gray-800 font-medium">{sale.datetime}</td>
                  <td className="py-4 px-6 text-sm text-gray-800 font-medium text-center">{sale.items}</td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-800">${sale.total}</td>
                  <td className="py-4 px-6 text-sm text-gray-800">
                    <div className="flex items-center gap-2">
                      {sale.method === "Efectivo" ? (
                        <Banknote size={20} className="text-gray-800" />
                      ) : (
                        <CreditCard size={20} className="text-gray-800" />
                      )}
                      <span className="font-medium">{sale.method}</span>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setSelectedSale(sale.rawSale)}
                        title="Ver detalle de venta"
                        className="p-2 hover:bg-secondary/10 rounded-lg transition-colors inline-flex items-center justify-center cursor-pointer"
                      >
                        <Eye size={22} className="text-black" />
                      </button>
                      <button
                        onClick={() => handleDownloadTicket(sale)}
                        title="Imprimir ticket"
                        className="p-2 hover:bg-secondary/10 rounded-lg transition-colors inline-flex items-center justify-center cursor-pointer"
                      >
                        <Printer size={22} className="text-primary" />
                      </button>
                    </div>
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

    {selectedSale && (
      <SaleDetailModal
        sale={selectedSale}
        onClose={() => setSelectedSale(null)}
      />
    )}
    </>
  );
}

export default AllSalesTable;