import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

function NewSale() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />
        <div className="p-6">
          <h1>Nueva venta</h1>
        </div>
      </div>
    </div>
  );
}

export default NewSale;