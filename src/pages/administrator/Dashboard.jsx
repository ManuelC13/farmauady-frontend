import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-6">
          <h1>Dashboard</h1>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;