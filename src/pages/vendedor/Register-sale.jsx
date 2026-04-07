import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

function RegisterSale() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Registro de ventas</h1>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-600">Aquí podrás registrar nuevas ventas.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterSale;