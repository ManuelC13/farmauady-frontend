import { useState } from "react";
import { confirmSaleRequest } from "../../api/sales/sales_routes";
import { generateTicketPDF } from "../../components/pdf/TicketPDF";
import { useToast } from "../../context/ToastContext";

export function useSaleConfirmation() {
  const [confirming, setConfirming] = useState(false);
  const [lastSale, setLastSale] = useState(null);
  const toast = useToast();

  const handleConfirmSale = async (cartSessionId, paymentMethod, onSuccess) => {
    setConfirming(true);
    try {
      const response = await confirmSaleRequest({
        cart_session_id: cartSessionId,
        payment_method: paymentMethod,
      });

      const sale = response.data;
      setLastSale(sale);
      toast.success(`Venta #${sale.folio} registrada por $${parseFloat(sale.total).toFixed(2)}`);

      if (onSuccess) {
        onSuccess(sale);
      }
    } catch (error) {
      const detail = error?.response?.data?.detail || "Error al registrar la venta. Intenta de nuevo.";
      toast.error("Error al registrar la venta. Intenta de nuevo.");
      toast.error(detail);
    } finally {
      setConfirming(false);
    }
  };

  const handlePrintTicket = async () => {
    if (!lastSale) return;

    try {
      const blob = await generateTicketPDF(lastSale);
      if (!blob) throw new Error("Error al generar PDF");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Ticket_${lastSale.folio}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`Ticket #${lastSale.folio} descargado correctamente`);
      setLastSale(null);
    } catch (error) {
      console.error("Error al generar el ticket PDF:", error);
      toast.error("No se pudo generar el ticket. Intenta de nuevo.");
    }
  };

  return {
    confirming,
    lastSale,
    setLastSale,
    handleConfirmSale,
    handlePrintTicket,
  };
}
