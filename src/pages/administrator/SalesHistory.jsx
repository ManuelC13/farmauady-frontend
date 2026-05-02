import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import AllSalesTable from "../../components/sales/AllSalesTable";
import { ListFilter, Search, ChevronDown } from "lucide-react";

const filterOptions = ["Hoy", "Esta semana", "Este mes", "Este año"];

function SalesHistory() {
  const [filterOpen, setFilterOpen]       = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Esta semana");
  const [searchTerm, setSearchTerm]       = useState("");

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <div className="flex-none">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
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

          <div className="flex-1 flex flex-col h-full min-h-0">
            <div className="flex-none flex justify-end gap-3 mb-6 mt-4">

              {/* Filtro por tiempo */}
              <div className="relative inline-block">
                <button
                  type="button"
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-400 rounded-lg text-gray-600 hover:bg-gray-50 transition shadow-sm h-11"
                >
                  <ListFilter size={20} className="text-gray-400" />
                  <span className="text-sm font-medium">
                    A partir de:{" "}
                    <span className="text-gray-400">{selectedFilter}</span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-gray-400 ml-1 transition-transform ${filterOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {filterOpen && (
                  <div className="absolute right-0 mt-2 min-w-[220px] bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
                    {filterOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setSelectedFilter(option);
                          setFilterOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Buscador */}
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
              <AllSalesTable
                searchTerm={searchTerm}
                timeFilter={selectedFilter}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SalesHistory;