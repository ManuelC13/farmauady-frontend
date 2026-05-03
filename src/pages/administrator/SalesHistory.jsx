import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import AllSalesTable from "../../components/sales/AllSalesTable";
import { Search } from "lucide-react";

function SalesHistory() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-50 min-h-screen">
        <Navbar />

        <main className="flex-1 flex flex-col p-8 min-h-0">
          <div className="flex-none">
            <h1 className="mt-4 mb-2 text-3xl font-bold text-gray-800">
              Historial de ventas
            </h1>
            <p className="text-sm text-gray-400 mb-6">
              Registro general de todas las ventas realizadas.
            </p>
          </div>

          <div className="flex-1 flex flex-col min-h-0 gap-4">
              {/* Buscador */}
              <div className="flex justify-end">
                <div className="relative flex items-center h-11">
                  <Search className="absolute left-3 text-blue-500" size={20} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por ID o por vendedor"
                    className="pl-11 pr-4 py-2 bg-white border border-blue-400 rounded-lg text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-200 transition shadow-sm h-full"
                  />
                </div>
              </div>

            {/* Tabla */}
            <div className="flex-1 min-h-0">
              <AllSalesTable searchTerm={searchTerm} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SalesHistory;