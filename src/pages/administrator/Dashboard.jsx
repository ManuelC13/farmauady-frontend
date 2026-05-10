import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { getDashboardSummaryRequest, getDashboardChartRequest } from "../../api/user/admin_dashboard_routes";
import { useToast } from "../../context/ToastContext";
import { usePresence } from "../../hooks/usePresence";
import { DollarSign, PackageCheck, AlertTriangle, UserCheck, ChevronDown } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

const PERIOD_OPTIONS = [
  { label: "Esta semana", value: "week" },
  { label: "Últimos 30 días",    value: "month" },
  { label: "Este año",    value: "year" },
];

const WEEK_DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MONTHS    = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function formatXAxis(period, value) {
  if (period === "week" || period === "month") {
    const date = new Date(value + "T00:00:00");
    if (period === "week") return WEEK_DAYS[date.getDay() === 0 ? 6 : date.getDay() - 1];
    return `${date.getDate()}/${date.getMonth() + 1}`;
  }
  if (period === "year") {
    const [, month] = value.split("-");
    return MONTHS[parseInt(month) - 1];
  }
  return value;
}

function SummaryCard({ title, value, icon: Icon, iconColor, subtitle }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-400 mb-2">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
      <Icon size={28} className={iconColor} />
    </div>
  );
}

function Dashboard() {
  const [summary, setSummary]       = useState(null);
  const [chartData, setChartData]   = useState([]);
  const [period, setPeriod]         = useState("week");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [loading, setLoading]       = useState(true);
  const toast = useToast();
  const { onlineCount } = usePresence();

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const { data } = await getDashboardSummaryRequest();
        setSummary(data);
      } catch {
        toast.error("Error al cargar el resumen del dashboard");
      }
    };
    loadSummary();
  }, []);

  useEffect(() => {
    const loadChart = async () => {
      try {
        setLoading(true);
        const { data } = await getDashboardChartRequest(period);
        setChartData(data);
      } catch {
        toast.error("Error al cargar la gráfica de ventas");
      } finally {
        setLoading(false);
      }
    };
    loadChart();
  }, [period]);

  const selectedPeriodLabel = PERIOD_OPTIONS.find(o => o.value === period)?.label;

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-background min-h-screen">
        <Navbar />

        <div className="p-6 px-10 pt-7">
          <h1 className="text-3xl font-bold mt-2 mb-1">General</h1>
          <p className="text-sm text-gray-400 mb-8">Resumen</p>

          {/* Tarjetas */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <SummaryCard
              title="Ventas del hoy"
              value={summary ? `$${summary.daily_sales.toFixed(2)}` : "—"}
              icon={DollarSign}
              iconColor="text-blue-500"
            />
            <SummaryCard
              title="Productos en stock"
              value={summary ? summary.total_stock.toLocaleString() : "—"}
              icon={PackageCheck}
              iconColor="text-green-500"
            />
            <SummaryCard
              title="Stock bajo"
              value={summary ? summary.low_stock_count : "—"}
              subtitle="productos"
              icon={AlertTriangle}
              iconColor="text-red-500"
            />
            <SummaryCard
              title="Usuarios conectados"
              value={onlineCount}
              icon={UserCheck}
              iconColor="text-purple-500"
            />
          </div>

          {/* Gráfica */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-gray-800">
                Resumen de ventas ({selectedPeriodLabel})
              </h2>

              {/* Dropdown periodo */}
              <div className="relative">
                <button
                  onClick={() => setPeriodOpen(!periodOpen)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                >
                  {selectedPeriodLabel}
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${periodOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {periodOpen && (
                  <div className="absolute right-0 mt-2 min-w-[160px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                    {PERIOD_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setPeriod(opt.value); setPeriodOpen(false); }}
                        className={`w-full text-left px-4 py-3 text-sm transition hover:bg-gray-50 ${
                          period === opt.value ? "font-semibold text-primary" : "text-gray-600"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chart */}
            {loading ? (
              <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                Cargando gráfica...
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-400 text-sm italic">
                No hay ventas en este periodo
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="period"
                    tickFormatter={(val) => formatXAxis(period, val)}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(val) => `$${val.toLocaleString()}`}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip
                    formatter={(value) => [`$${parseFloat(value).toFixed(2)}`, "Ventas"]}
                    labelFormatter={(label) => formatXAxis(period, label)}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      fontSize: "13px"
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;