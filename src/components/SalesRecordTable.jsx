import { Printer, Banknote, CreditCard, ChevronDown, Loader2, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { getMySalesRequest } from "../api/sales/sales_routes";
import { useToast } from "../context/ToastContext";
import { generateTicketPDF } from "./pdf/TicketPDF";

function SalesRecordTable({ sales: propSales, searchTerm = "", timeFilter = "" }) {
  const [sales, setSales] = useState(propSales || []);
  const [loading, setLoading] = useState(!propSales);
  const toast = useToast();

  useEffect(() => {
    if (propSales && propSales.length > 0) {
      setSales(propSales);
      setLoading(false);
      return;
    }
    
    const fetchAllSales = async () => {
      try {
        setLoading(true);
        const { data } = await getMySalesRequest();
        const mappedSales = data.map(sale => ({
          id: sale.folio,
          datetime: new Date(sale.sale_date).toLocaleString("es-MX", { 
            day: '2-digit', month: '2-digit', year: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
          }),
          rawDate: new Date(sale.sale_date),
          items: sale.details.reduce((sum, item) => sum + item.quantity, 0),
          total: parseFloat(sale.total).toFixed(2),
          method: sale.payment_method ? (sale.payment_method.charAt(0).toUpperCase() + sale.payment_method.slice(1)) : "Efectivo",
          // Guardamos el objeto completo para poder generar el PDF
          rawSale: sale,
        }));
        setSales(mappedSales);
      } catch (error) {
        toast.error("Error cargando el historial de ventas");
        console.error("Error cargando el historial de ventas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSales();
  }, [propSales]);

  const displaySales = sales.filter(sale => {
    // Filtrar por ID de Venta (En este caso el folio)
    if (searchTerm && !sale.id.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filtrar por fecha
    if (timeFilter && sale.rawDate) {
      const now = new Date();
      const saleDate = sale.rawDate;
      const msPerDay = 24 * 60 * 60 * 1000;
      
      switch (timeFilter) {
        case "Hoy":
          if (saleDate.toDateString() !== now.toDateString()) return false;
          break;
        case "Esta semana":
          // Aproximación: últimos 7 días
          if (now.getTime() - saleDate.getTime() > 7 * msPerDay) return false;
          break;
        case "Este mes":
          if (saleDate.getMonth() !== now.getMonth() || saleDate.getFullYear() !== now.getFullYear()) return false;
          break;
        case "Este año":
          if (saleDate.getFullYear() !== now.getFullYear()) return false;
          break;
        default:
          break;
      }
    }
    
    return true;
  });

  // Genera y descarga el PDF del ticket
  const handleDownloadTicket = async (sale) => {
    if (!sale.rawSale) {
      toast.error("No se encontraron los detalles de esta venta.");
      return;
    }
    try {
      const blob = await generateTicketPDF(sale.rawSale);
      if (!blob) throw new Error("Error al generar PDF");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Ticket_${sale.id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`Ticket #${sale.id} descargado correctamente`);
    } catch (error) {
      console.error("Error al generar el ticket PDF:", error);
      toast.error("No se pudo generar el ticket. Intenta de nuevo.");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full flex flex-col">
      {/* Tabla con scroll */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#EDF5FF] sticky top-0 z-10 shadow-sm border-b border-blue-100">
              <th className="py-4 px-6 text-[#A0C4FF] font-semibold text-xs uppercase tracking-wider text-left bg-[#EDF5FF]">ID de venta</th>
              <th className="py-4 px-6 text-[#A0C4FF] font-semibold text-xs uppercase tracking-wider text-left bg-[#EDF5FF]">Fecha y hora</th>
              <th className="py-4 px-6 text-[#A0C4FF] font-semibold text-xs uppercase tracking-wider text-center bg-[#EDF5FF]">Artículos</th>
              <th className="py-4 px-6 text-[#A0C4FF] font-semibold text-xs uppercase tracking-wider text-left bg-[#EDF5FF]">Total</th>
              <th className="py-4 px-6 text-[#A0C4FF] font-semibold text-xs uppercase tracking-wider text-left bg-[#EDF5FF]">Método de pago</th>
              <th className="py-4 px-6 text-[#A0C4FF] font-semibold text-xs uppercase tracking-wider text-center bg-[#EDF5FF]">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Loader2 className="animate-spin text-blue-500" size={32} />
                    <span className="text-sm font-medium">Cargando historial de ventas...</span>
                  </div>
                </td>
              </tr>
            ) : displaySales.length > 0 ? (
              displaySales.map((sale, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-5 px-6 text-sm font-bold text-gray-800">{sale.id}</td>
                  <td className="py-5 px-6 text-sm text-gray-600 font-medium">{sale.datetime}</td>
                  <td className="py-5 px-6 text-sm text-gray-600 text-center font-bold">{sale.items}</td>
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
                    <button
                      onClick={() => handleDownloadTicket(sale)}
                      title="Descargar ticket PDF"
                      className="p-2 hover:bg-blue-50 rounded-full transition-colors inline-flex items-center justify-center"
                    >
                      <Printer size={20} className="text-[#007BFF]" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-12 text-center text-gray-400 italic">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Info size={32} className="text-gray-300" />
                    <span className="text-sm font-medium">No hay ventas registradas aún</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalesRecordTable;