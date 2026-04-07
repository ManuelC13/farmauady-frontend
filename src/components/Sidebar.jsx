import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ModalConfirmation from "./ModalConfirmation";
import { useState } from "react";
import {
  LayoutGrid,
  UsersRound,
  Archive,
  BadgeDollarSign,
  TrendingUp,
  Receipt,
  Boxes,
  User,
  LogOut,
  Cross
} from "lucide-react";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const roleName = user?.role ?? "";
  const roleLabel = roleName.toUpperCase();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const allMenuItems = [
    { name: "Dashboard",             path: "/dashboard",     icon: LayoutGrid,       roles: ["Administrador"] },
    { name: "Gestión de usuarios",   path: "/users",         icon: UsersRound,       roles: ["Administrador"] },
    { name: "Gestión de inventario", path: "/inventory",     icon: Archive,          roles: ["Administrador"] },
    { name: "Historial de ventas",   path: "/sales",         icon: BadgeDollarSign,  roles: ["Administrador"] },
    { name: "Reportes",              path: "/reports",       icon: TrendingUp,       roles: ["Administrador"] },
    { name: "Dashboard",             path: "/vendedor/dashboard",     icon: LayoutGrid,       roles: ["Vendedor"] },
    { name: "Registro de ventas",    path: "/vendedor/register-sale", icon: Receipt,          roles: ["Vendedor"] },
    { name: "Productos",             path: "/vendedor/products",      icon: Boxes,            roles: ["Vendedor"] },
  ];

  const menu = allMenuItems.filter(item => item.roles.includes(roleName));

  return (
  <>
    <div className="w-64 h-screen bg-blue-700 text-white flex flex-col justify-between">
      
      {/* Top */}
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-6 text-xl font-bold">
          <Cross size={30} strokeWidth={2.5}/>
          FarmaUady
        </div>

        {/* Section */}
        <p className="px-6 text-sm text-blue-200 mb-4 mt-6">{roleLabel}</p>

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
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          <LogOut size={20} />
          Cerrar sesión
        </button>
      </div>
    </div>

      <ModalConfirmation
        isOpen={showLogoutModal}
        title="¿Cerrar sesión?"
        message="¿Estás seguro que deseas cerrar sesión? Tendrás que volver a ingresas tus credenciales la proxima vez"
        confirmText="Cerrar sesión"
        cancelText="Cancelar"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
}

export default Sidebar;