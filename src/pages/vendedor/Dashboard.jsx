import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import RecentSalesTable from "../../components/RecentSalesTable";
import { Plus, Search, DollarSign, Pill } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDailyStatsRequest } from "../../api/sales/sales_routes";

function DashboardVendedor() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ total_sales: 0, items_sold: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getDailyStatsRequest();
                setStats(res.data);
            } catch (error) {
                toast.error("Error al obtener estadísticas");
            }
        };
        fetchStats();
    }, []);

    const actualDate = new Date();

    let actualiDateFormatted = actualDate.toLocaleDateString("es-MX", {
        weekday: "long",
        day: "2-digit",
        month: "long",
    });

    actualiDateFormatted =
        actualiDateFormatted.charAt(0).toUpperCase() +
        actualiDateFormatted.slice(1).replace(",", "");

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
                            Hola, {user?.name || "Vendedor"}
                        </h1>

                        <p className="mb-8 text-gray-500 font-medium">
                            Aquí tienes un resumen de tu turno de hoy,{" "}
                            {actualiDateFormatted}
                        </p>
                    </div>

                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-0">
                        <div className="lg:col-span-3 flex flex-col h-full min-h-0">

                            {/* Botones de Acción */}
                            <div className="flex-none flex gap-4 mb-8">
                                <button 
                                    onClick={() => navigate("/vendedor/new-sale")}
                                    className="bg-[#007BFF] hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-sm"
                                >
                                    <Plus size={20} />
                                    Nueva venta
                                </button>

                                <button className="bg-[#007BFF] hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-sm">
                                    <Search size={20} />
                                    Consultar artículo
                                </button>
                            </div>

                            {/* Tabla de Ventas */}
                            <div className="flex-1 min-h-0">
                                <RecentSalesTable />
                            </div>
                        </div>

                        {/* Sidebar de Resumen */}
                        <div className="lg:col-span-1 flex flex-col h-full">
                            <h2 className="flex-none h-[44px] flex items-center text-gray-400 font-bold text-sm uppercase tracking-wider mb-8">
                                Resumen
                            </h2>

                            <div className="flex-none space-y-6">
                                {/* Card: Ventas del día */}
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-400 text-sm font-semibold mb-1">Ventas del día</p>
                                        <p className="text-2xl font-bold text-gray-800">
                                            ${new Intl.NumberFormat("es-MX", { minimumFractionDigits: 2 }).format(stats.total_sales)}
                                        </p>
                                    </div>
                                    <div className="bg-blue-50 p-2 rounded-lg">
                                        <DollarSign className="text-blue-500" size={24} />
                                    </div>
                                </div>

                                {/* Card: Artículos vendidos */}
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-400 text-sm font-semibold mb-1">Artículos vendidos</p>
                                        <p className="text-2xl font-bold text-gray-800">{stats.items_sold}</p>
                                    </div>
                                    <div className="bg-green-50 p-2 rounded-lg">
                                        <Pill className="text-green-500" size={24} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </main>
            </div>

        </div>
    );
}

export default DashboardVendedor;