import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import ProductTable from "../../components/ProductTable";
import { ListFilter, Search, ChevronDown } from "lucide-react";

function Products() {
  // Estados para la categoria
  const [catOpen, setCatOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState("Todas");
  const catOptions = ["Todas", "Analgésicos", "Antibióticos", "Gastrointestinal", "Material"];

  // Estados para el estado del producto
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const statusOptions = ["Todos", "Disponible", "Stock crítico", "Agotado"];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <div className="flex-none">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />

        <main className="flex-1 flex flex-col p-8 min-h-0">
          <div className="flex-none">
            <h1 className="mt-4 mb-2 text-3xl font-bold text-gray-800 text-left">
              Catálogo de Productos
            </h1>
          </div>

          <div className="flex-1 flex flex-col h-full min-h-0">
            <div className="flex-none flex justify-end gap-3 mb-6 mt-4">
              
              {/* Dropdown de la categoria */}
              <div className="relative inline-block">
                <button
                  onClick={() => {
                    setCatOpen(!catOpen);
                    setStatusOpen(false); // Cerrar el otro si está abierto
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-400 rounded-lg text-gray-600 hover:bg-gray-50 transition shadow-sm h-11"
                >
                  <ListFilter size={20} className="text-gray-400" />
                  <span className="text-sm font-medium">Categoría: <span className="text-gray-400">{selectedCat}</span></span>
                  <ChevronDown size={18} className={`text-gray-400 ml-1 transition-transform ${catOpen ? "rotate-180" : ""}`} />
                </button>

                {catOpen && (
                  <div className="absolute right-0 mt-2 min-w-[200px] bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
                    {catOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSelectedCat(option);
                          setCatOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dropdown del estado */}
              <div className="relative inline-block">
                <button
                  onClick={() => {
                    setStatusOpen(!statusOpen);
                    setCatOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-400 rounded-lg text-gray-600 hover:bg-gray-50 transition shadow-sm h-11"
                >
                  <ListFilter size={20} className="text-gray-400" />
                  <span className="text-sm font-medium">Estado: <span className="text-gray-400">{selectedStatus}</span></span>
                  <ChevronDown size={18} className={`text-gray-400 ml-1 transition-transform ${statusOpen ? "rotate-180" : ""}`} />
                </button>

                {statusOpen && (
                  <div className="absolute right-0 mt-2 min-w-[200px] bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
                    {statusOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSelectedStatus(option);
                          setStatusOpen(false);
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
                  placeholder="Buscar por SKU o nombre de producto"
                  className="pl-11 pr-4 py-2 bg-white border border-blue-400 rounded-lg text-sm w-80 focus:outline-none focus:ring-2 focus:ring-blue-200 transition shadow-sm h-full"
                />
              </div>
            </div>

            {/* Tabla */}
            <div className="flex-1 min-h-0">
              <ProductTable />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


export default Products;