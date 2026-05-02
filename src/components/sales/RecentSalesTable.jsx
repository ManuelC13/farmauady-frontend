import { Eye, Printer, Loader2, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { getRecentSalesRequest } from "../../api/sales/sales_routes";
import { useToast } from "../../context/ToastContext";
import { parseUtcDate } from "../../utils/dateUtils";
import { generateTicketPDF } from "../pdf/TicketPDF";
import SaleDetailModal from "./SaleDetailModal";


function RecentSalesTable({ sales: propSales }) {
  const [sales, setSales] = useState(propSales || []);
  const [loading, setLoading] = useState(!propSales);
  const [selectedSale, setSelectedSale] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (propSales && propSales.length > 0) {
      setSales(propSales);
      setLoading(false);
      return;
    }
    
    const fetchRecentSales = async () => {
      try {
        setLoading(true);
        const { data } = await getRecentSalesRequest(5);
        const mappedSales = data.map(sale => ({
          id: sale.folio,
          time: parseUtcDate(sale.sale_date).toLocaleTimeString("es-MX", { hour: 'numeric', minute: '2-digit', hour12: true }),
          items: sale.details.reduce((sum, item) => sum + item.quantity, 0),
          total: parseFloat(sale.total),
          rawSale: sale,
        }));
        setSales(mappedSales);
      } catch (error) {
        toast.error("Error cargando ventas recientes");
        console.error("Error cargando ventas recientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentSales();
  }, [propSales]);

  const displaySales = sales;

  const handlePrint = async (rawSale) => {
    try {
      const blob = await generateTicketPDF(rawSale);
      if (!blob) throw new Error();
      const url  = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href  = url;
      link.download = `Ticket_${rawSale.folio}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`Ticket #${rawSale.folio} descargado`);
    } catch {
      toast.error("No se pudo generar el ticket. Intenta de nuevo.");
    }
  };

  return (
    <>
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full flex flex-col">
      {/* Header de la tabla*/}
      <div className="flex-none flex justify-between items-center p-4 border-b border-gray-50">
        <h2 className="text-xl font-bold text-gray-800">Ventas recientes</h2>
        <button 
        onClick={() => navigate("/vendedor/register-sale")}
        className="px-4 py-1.5 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
          Ver todo
        </button>
      </div>

      {/* Tabla con scroll */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#EDF5FF] sticky top-0 z-10 shadow-sm">
              <th className="py-3 px-6 text-[#A0C4FF] font-semibold text-xs uppercase tracking-wider text-left bg-[#EDF5FF]">ID</th>
              <th className="py-3 px-6 text-[#A0C4FF] font-semibold text-xs uppercase tracking-wider text-left bg-[#EDF5FF]">Hora</th>
              <th className="py-3 px-6 text-[#A0C4FF] font-semibold text-xs uppercase tracking-wider text-center bg-[#EDF5FF]">Artículos</th>
              <th className="py-3 px-6 text-[#A0C4FF] font-semibold text-xs uppercase tracking-wider text-left bg-[#EDF5FF]">Total</th>
              <th className="py-3 px-6 text-[#A0C4FF] font-semibold text-xs uppercase tracking-wider text-center bg-[#EDF5FF]">Acciones</th>
            </tr>
          </thead>

        <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="animate-spin text-blue-500" size={24} />
                    <span className="text-sm">Cargando ventas...</span>
                  </div>
                </td>
              </tr>
            ) : displaySales.length > 0 ? (
              displaySales.map((sale, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-sm font-medium text-gray-700">{sale.id}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{sale.time}</td>
                  <td className="py-4 px-6 text-sm text-gray-600 text-center">{sale.items}</td>
                  <td className="py-4 px-6 text-sm font-bold text-gray-800">${sale.total.toFixed(2)}</td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setSelectedSale(sale.rawSale)}
                        title="Ver detalle"
                        className="p-1.5 hover:bg-blue-50 rounded-full transition-colors inline-flex items-center justify-center"
                      >
                        <Eye size={18} className="text-gray-500 hover:text-blue-600" />
                      </button>
                      <button
                        onClick={() => handlePrint(sale.rawSale)}
                        title="Descargar ticket"
                        className="p-1.5 hover:bg-blue-50 rounded-full transition-colors inline-flex items-center justify-center"
                      >
                        <Printer size={18} className="text-[#007BFF]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-400 italic">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Info size={24} className="text-gray-300" />
                    <span className="text-sm">No hay ventas recientes</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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

export default RecentSalesTable;