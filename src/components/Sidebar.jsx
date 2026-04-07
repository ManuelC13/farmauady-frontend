import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Package,
  DollarSign,
  BarChart3,
  User,
  LogOut,
  Cross
} from "lucide-react";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Gestión de usuarios", path: "/users", icon: Users },
    { name: "Gestión de inventario", path: "/inventory", icon: Package },
    { name: "Historial de ventas", path: "/sales", icon: DollarSign },
    { name: "Reportes", path: "/reports", icon: BarChart3 },
  ];

  return (
    <div className="w-64 h-screen bg-blue-700 text-white flex flex-col justify-between">
      
      {/* Top */}
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-6 text-xl font-bold">
          <Cross size={30} strokeWidth={2.5}/>
          FarmaUady
        </div>

        {/* Section */}
        <p className="px-6 text-sm text-blue-200 mb-4 mt-6">ADMINISTRADOR</p>

        {/* Menu */}
        <nav className="flex flex-col gap-2 px-3">
          {menu.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
                  ${
                    isActive
                      ? "bg-blue-800"
                      : "hover:bg-blue-600"
                  }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Config */}
        <p className="px-6 mt-6 text-sm text-blue-200">CONFIGURACIÓN</p>

        <div className="p-4">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            <User size={20} />
            Mi perfil
          </Link>
        </div>
      </div>

      {/* Bottom */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          <LogOut size={20} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Sidebar;