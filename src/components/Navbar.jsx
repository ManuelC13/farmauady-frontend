import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();

  const routes = {
    "/dashboard": "Dashboard",
    "/users": "Gestión de usuarios",
    "/vendedor/dashboard": "Dashboard",
    "/vendedor/new-sale": "Nueva venta",
    "/vendedor/register-sale": "Registro de ventas",
    "/vendedor/products": "Productos",
  };

  const page = routes[location.pathname] || "";

  const { user } = useAuth();
  const userRole = user?.role || "Administrador";
  
  return (
    <div className="w-full h-16 bg-white flex items-center justify-between px-6 shadow-sm">
      
      <h1 className="text-md font-semibold text-gray-700">
        {userRole} / <span className="text-primary">{page}</span>
      </h1>

      <div className="flex items-center gap-5 cursor-pointer">
        <div className="text-sm text-right">
            <p className="font-medium text-gray-700">{user?.name || "Usuario"}</p>
            <p className="font-medium text-primary text-xs">{userRole}</p>
        </div>

        <img // Hay que cambiar por la imagen de perfil real del usuario
          src="https://i.pravatar.cc/40"
          alt="user"
          className="w-10 h-10 rounded-full"
        />
      </div>

    </div>
  );
}

export default Navbar;