import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import AllSalesTable from "../../components/sales/AllSalesTable";
import { getSellersRequest } from "../../api/user/user_routes";
import { Search, FileDown, Funnel } from "lucide-react";

function SalesHistory() {
  const [triggerExport, setTriggerExport] = useState(0);
  const [searchTerm, setSearchTerm]       = useState("");
  const [startDate, setStartDate]         = useState("");
  const [endDate, setEndDate]             = useState("");
  const [sellerId, setSellerId]           = useState("");
  const [appliedFilters, setAppliedFilters] = useState({});
  const [sellers, setSellers]             = useState([]);


  useEffect(() => {
    const timeout = setTimeout(() => {
      setAppliedFilters(prev => ({
        ...prev,
        search: searchTerm || undefined,
      }));
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getSellersRequest();
        setSellers(data);
      } catch {}
    };
    load();
  }, []);

  const handleFilter = () => {
    const newFilters = {};
    if (startDate)  newFilters.start_date = startDate;
    if (endDate)    newFilters.end_date   = endDate;
    if (sellerId)   newFilters.seller_id  = sellerId;
    if (searchTerm) newFilters.search     = searchTerm;
    setAppliedFilters(newFilters);
  };

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setSellerId("");
    setAppliedFilters({});
  };

  const inputBase = "border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-background h-10";

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-background min-h-screen">
        <Navbar />
        <div className="p-6 px-10 pt-7">

          {/* Título y botón exportar */}
          <div className="flex items-center justify-between mt-2 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Historial de ventas</h1>
              <p className="text-sm text-gray-400 mt-1">Registro general de todas las ventas realizadas.</p>
            </div>
            <button
              onClick={() => setTriggerExport(n => n + 1)}
              className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-secondary transition cursor-pointer"
            >
              <FileDown size={20} /> Descargar reporte de ventas
            </button>
          </div>

          {/* Filtros */}
          <div className="flex items-end justify-between gap-3 mt-13 mb-6">

            {/* Buscador — izquierda */}
            <div className="flex flex-col gap-1">
              <div className="relative flex items-center">
                <Search className="absolute left-3 text-gray-500" size={16} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por ID de venta"
                  className="pl-10 pr-4 bg-white border border-gray-300 rounded-lg text-sm w-80 focus:outline-none focus:ring-2 focus:ring-blue-400 h-10"
                />
              </div>
            </div>

            {/* Filtros — derecha */}
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Fecha inicio</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputBase} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Fecha fin</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputBase} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Vendedor</label>
                <select value={sellerId} onChange={(e) => setSellerId(e.target.value)} className={`${inputBase} min-w-[160px]`}>
                  <option value="">Todos</option>
                  {sellers.map((s) => (
                    <option key={s.id_user} value={s.id_user}>{s.first_name} {s.last_name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleFilter}
                className="h-10 px-4 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-secondary transition cursor-pointer flex items-center gap-2 self-end"
              >
                <Funnel size={16} /> Filtrar
              </button>

              <button
                onClick={handleClearFilters}
                className="h-10 px-4 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition cursor-pointer self-end"
              >
                Limpiar
              </button>
            </div>
          </div>

          {/* Tabla */}
          <AllSalesTable
            searchTerm={searchTerm}
            appliedFilters={appliedFilters}
            triggerExport={triggerExport}
          />
        </div>
      </div>
    </div>
  );
}

export default SalesHistory;