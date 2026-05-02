import { X, Receipt, Banknote, CreditCard, Calendar, Clock, User, Package } from "lucide-react";
import { parseUtcDate } from "../../utils/dateUtils";
import { generateTicketPDF } from "../pdf/TicketPDF";
import { useToast } from "../../context/ToastContext";

function SaleDetailModal({ sale, onClose }) {
  const toast = useToast();

  if (!sale) return null;

  const dateObj  = parseUtcDate(sale.sale_date);
  const fecha    = dateObj.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
  const hora     = dateObj.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: true });
  const total    = parseFloat(sale.total);
  const subtotal = sale.details?.reduce((s, d) => s + parseFloat(d.subtotal), 0) ?? total;
  const metodo   = sale.payment_method
    ? sale.payment_method.charAt(0).toUpperCase() + sale.payment_method.slice(1)
    : "Efectivo";

  const handlePrint = async () => {
    try {
      const blob = await generateTicketPDF(sale);
      if (!blob) throw new Error();
      const url  = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href  = url;
      link.download = `Ticket_${sale.folio}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`Ticket #${sale.folio} descargado`);
    } catch {
      toast.error("No se pudo generar el ticket. Intenta de nuevo.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#E9F4FF] px-6 py-5 flex items-start justify-between border-b border-blue-100">
          <div>
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-0.5">
              Detalle de venta
            </p>
            <h2 className="text-xl font-black text-blue-700 tracking-tight font-mono">
              {sale.folio}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-blue-100 text-blue-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-3 px-6 py-4 bg-white border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={14} className="text-blue-400 shrink-0" />
            <span className="text-sm font-medium">{fecha}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={14} className="text-blue-400 shrink-0" />
            <span className="text-sm font-medium">{hora}</span>
          </div>
          {sale.seller_name && (
            <div className="flex items-center gap-2 text-gray-600">
              <User size={14} className="text-blue-400 shrink-0" />
              <span className="text-sm font-medium">{sale.seller_name}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-600">
            {metodo === "Efectivo"
              ? <Banknote size={14} className="text-blue-400 shrink-0" />
              : <CreditCard size={14} className="text-blue-400 shrink-0" />
            }
            <span className="text-sm font-medium">{metodo}</span>
          </div>
        </div>

        {/* Productos */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Package size={12} /> Productos
          </p>

          {sale.details && sale.details.length > 0 ? (
            <div className="space-y-2">
              {sale.details.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{item.product_name}</p>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      {item.quantity} × ${parseFloat(item.unit_price).toFixed(2)}
                    </p>
                  </div>
                  <span className="text-sm font-black text-blue-600 ml-3 shrink-0">
                    ${parseFloat(item.subtotal).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic text-center py-4">
              No hay detalles disponibles
            </p>
          )}
        </div>

        {/* Footer*/}
        <div className="px-6 py-4 bg-white border-t border-gray-100">
          <div className="flex justify-between items-center text-sm text-gray-500 mb-1">
            <span>Subtotal</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-base font-bold text-gray-700">Total</span>
            <span className="text-xl font-black text-blue-600">${total.toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onClose}
              className="py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={handlePrint}
              className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors active:scale-95"
            >
              <Receipt size={16} />
              Ticket PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SaleDetailModal;
