import { Eye } from "lucide-react";

function RecentSalesTable({ sales = [] }) {
  //Mock de datos
  const displaySales = sales.length > 0 ? sales : [
    { id: "804210", time: "10:45 AM", items: 3, total: 455 },
    { id: "804210", time: "10:45 AM", items: 3, total: 455 },
    { id: "804210", time: "10:45 AM", items: 3, total: 455 },
    { id: "804210", time: "10:45 AM", items: 3, total: 455 },
    { id: "804210", time: "10:45 AM", items: 3, total: 455 },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full flex flex-col">
      {/* Header de la tabla*/}
      <div className="flex-none flex justify-between items-center p-4 border-b border-gray-50">
        <h2 className="text-xl font-bold text-gray-800">Ventas recientes</h2>
        <button className="px-4 py-1.5 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
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
              <th className="py-3 px-6 text-[#A0C4FF] font-semibold text-xs uppercase tracking-wider text-center bg-[#EDF5FF]">Acción</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 italic">
            {displaySales.map((sale, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 text-sm font-medium text-gray-700">{sale.id}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{sale.time}</td>
                <td className="py-4 px-6 text-sm text-gray-600 text-center">{sale.items}</td>
                <td className="py-4 px-6 text-sm font-bold text-gray-800">${sale.total}</td>
                <td className="py-4 px-6 text-center">
                  <button className="p-1 hover:bg-gray-200 rounded-full transition-colors inline-flex items-center justify-center">
                    <Eye size={20} className="text-gray-800" />
                  </button>
                </td>
              </tr>
            ))}
            {sales.length === 0 && Array(5).fill(null).map((_, i) => (
              <tr key={`mock-${i}`} className="hover:bg-gray-50 transition-colors opacity-40">
                <td className="py-4 px-6 text-sm font-medium text-gray-700">804210</td>
                <td className="py-4 px-6 text-sm text-gray-600">10:45 AM</td>
                <td className="py-4 px-6 text-sm text-gray-600 text-center">3</td>
                <td className="py-4 px-6 text-sm font-bold text-gray-800">$455</td>
                <td className="py-4 px-6 text-center">
                  <button className="p-1 hover:bg-gray-200 rounded-full transition-colors inline-flex items-center justify-center">
                    <Eye size={20} className="text-gray-800" />
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

export default RecentSalesTable;