import { useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const routes = {
    "/dashboard": "Dashboard",
    "/users": "Gestión de usuarios",
  };

  const page = routes[location.pathname] || "";

  // Hay que cambiar por el contexto del rol real del usuario
  const userRole = "Administrador";

  const title = `${userRole} / ${page}`;

  return (
    <div className="w-full h-16 bg-white flex items-center justify-between px-6 shadow-sm">
      
      <h1 className="text-md font-semibold text-gray-700">
        {title}
      </h1>

      <div className="flex items-center gap-5 cursor-pointer">
        <div className="text-sm text-right">
            <p className="font-medium text-gray-700">Manuel Cupul</p>  {/* Hay que cambiar por el nombre real del usuario */}
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