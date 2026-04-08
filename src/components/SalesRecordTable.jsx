import { Printer, Banknote, CreditCard, ChevronDown } from "lucide-react";

function SalesRecordTable({ sales = [] }) {
  // Mock de datos para el historial
  const displaySales = sales.length > 0 ? sales : [
    { id: "010101", datetime: "10/04/2026, 10:25", items: 3, total: "245.00", method: "Efectivo" },
    { id: "020202", datetime: "10/04/2026, 08:45", items: 1, total: "45.00", method: "Tarjeta" },
    { id: "030303", datetime: "09/04/2026, 11:00", items: 5, total: "850.00", method: "Efectivo" },
    { id: "040404", datetime: "09/04/2026, 10:50", items: 2, total: "120.00", method: "Efectivo" },
  ];

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
            {displaySales.map((sale, index) => (
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
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors inline-flex items-center justify-center">
                    <Printer size={20} className="text-[#007BFF]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalesRecordTable;