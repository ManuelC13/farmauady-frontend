import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

function DashboardVendedor() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Dashboard Vendedor</h1>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-600">Bienvenido al sistema. Aquí podrás ver un resumen de tus ventas del día.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardVendedor;