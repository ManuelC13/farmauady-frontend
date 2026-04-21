import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { User, Mail, UserCircle, Key, Edit, Save, X } from "lucide-react";
import ChangePasswordModal from "../components/ChangePasswordModal";
import { updateOwnProfileRequest } from "../api/user/user_routes";
import { useToast } from "../context/ToastContext";


function Profile() {
  const { user, refreshUser } = useAuth();

  const isAdmin = user?.role === "Administrador";

  const toast = useToast()

  const [isEditing, setIsEditing]                   = useState(false);
  const [nombre, setNombre]                         = useState("");
  const [apellido, setApellido]                     = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [saving, setSaving]                         = useState(false);
  const [saveError, setSaveError]                   = useState("");

  useEffect(() => {
    if (user?.name) {
      const parts = user.name.split(" ");
      setNombre(parts[0] || "");
      setApellido(parts.slice(1).join(" ") || "");
    }
  }, [user]);

  const handleCancel = () => {
    const parts = user?.name?.split(" ") || [];
    setNombre(parts[0] || "");
    setApellido(parts.slice(1).join(" ") || "");
    setSaveError("");
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!nombre.trim() || !apellido.trim()) {
      toast.error("El nombre y apellido no pueden estar vacíos");
      return;
    }
    setSaving(true);
    setSaveError("");
    try {
      await updateOwnProfileRequest({
        first_name: nombre.trim(),
        last_name: apellido.trim(),
      });
      await refreshUser();
      setIsEditing(false);
      toast.success("Cambios guardados exitosamente");

    } catch (err) {
      setSaveError(err?.response?.data?.detail || "Error al guardar los cambios");
      toast.error("error al guardar los cambios")
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <div className="flex-none">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
          <div className="max-w-4xl mx-auto">
            {/* Tarjeta principal */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
              {/* Header del perfil */}
              <div className="p-8 pb-4 flex flex-col md:flex-row items-center gap-8 border-b border-gray-100">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-600 shadow-inner">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-gray-800 mb-1">
                    {user?.name || "Cargando..."}
                  </h2>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
                    <span className="text-blue-600 font-semibold">{user?.role || ""}</span>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                      user?.status === "ACTIVO"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}>
                      Estado: {user?.status || "ACTIVO"}
                    </span>
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-3">
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition shadow-md"
                        >
                          <Edit size={18} />
                          Editar Perfil
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition shadow-md disabled:opacity-60"
                          >
                            <Save size={18} />
                            {saving ? "Guardando..." : "Guardar"}
                          </button>
                          <button
                            onClick={handleCancel}
                            disabled={saving}
                            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2.5 rounded-xl font-bold transition"
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}
                    </div>
                    {saveError && (
                      <p className="text-xs text-red-500 font-medium">{saveError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Contenido del formulario */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Nombre */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 ml-1">Nombre(s)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <User size={18} />
                      </div>
                      <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        readOnly={!isAdmin || !isEditing}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all ${
                          !isAdmin || !isEditing
                            ? "bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200"
                            : "border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Apellido */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 ml-1">Apellido(s)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <UserCircle size={18} />
                      </div>
                      <input
                        type="text"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        readOnly={!isAdmin || !isEditing}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all ${
                          !isAdmin || !isEditing
                            ? "bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200"
                            : "border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Correo Electrónico */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-gray-500 ml-1">Correo Electrónico (No modificable)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        value={user?.email || ""}
                        onChange={() => {}}
                        readOnly
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
                      />
                    </div>
                  </div>
                </div>

                <hr className="my-10 border-gray-100" />

                {/* Botones */}
                <div className="flex">
                  <button
                    onClick={() => setShowChangePassword(true)}
                    className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold transition shadow-sm bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Key size={18} />
                    Cambiar contraseña
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal cambio de contraseña */}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </div>
  );
}

export default Profile;