import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();

  const routes = {
    "/dashboard": "Dashboard",
    "/users": "Gestión de usuarios",
  };

  const page = routes[location.pathname] || "";

  const { user } = useAuth();
  const userRole = user?.role || "Administrador";
  const userName = user?.name || "Usuario";

  const title = `${userRole} / ${page}`;

  return (
    <div className="w-full h-18 bg-background flex items-center justify-between px-6 shadow-sm">
      
      <h1 className="text-md font-semibold text-gray-700">
        {title}
      </h1>

      <div className="flex items-center gap-5 cursor-pointer">
        <div className="text-sm text-right">
            <p className="font-medium text-gray-700">{user?.name || "Usuario"}</p>
            <p className="font-medium text-primary text-xs">{userRole}</p>
        </div>

        <div className="w-12 h-12 rounded-full bg-blue-200 text-secondary flex items-center justify-center text-xl font-semibold flex-shrink-0">
          {userName?.[0]?.toUpperCase()}
        </div>
      </div>

    </div>
  );
}

export default Navbar;