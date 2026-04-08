import { useState, useEffect } from "react";
import { CircleX } from "lucide-react";

function UserModal({ isOpen, onClose, onCreate, onUpdate, editingUser }) {
  const isEditMode = !!editingUser;

  const initialForm = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    id_role: "Vendedor",
    status: "Activo",
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (editingUser) {
      setForm({
        first_name: editingUser.first_name || "",
        last_name: editingUser.last_name || "",
        email: editingUser.email || "",
        password: "",        
        confirm_password: "", 
        id_role: editingUser.role?.name || "Vendedor",
        status: editingUser.status === "ACTIVO" ? "Activo" : "Inactivo",
      });
    } else {
      setForm(initialForm);
    }
  }, [editingUser]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const roleMap = { 
      Administrador: 1, 
      Vendedor: 2 
    };

    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      id_role: roleMap[form.id_role],
      status: form.status === "Activo" ? "ACTIVO" : "INACTIVO",
    };

    if (!isEditMode) {
      if (!form.password) {
        alert("La contraseña es obligatoria");
        return;
      }
      if (form.password !== form.confirm_password) {
        alert("Las contraseñas no coinciden");
        return;
      }
      payload.password = form.password;
      await onCreate(payload);
    } else {
      // Si el usuario escribe una nueva contraseña se valida e incluye en el payload. Si no, se mantiene la actual.
      if (form.password || form.confirm_password) {
        if (form.password !== form.confirm_password) {
          alert("Las contraseñas no coinciden");
          return;
        }
        payload.password = form.password;
      }
      await onUpdate(editingUser.id_user, payload);
    }

    onClose();
  };

  const handleClose = () => {
    setForm(initialForm);
    onClose();
  };

  const inputBase = "w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-400";
  const inputEnabled = "border-gray-400 bg-gray-100 placeholder-gray-400";
  const inputDisabled = "border-gray-300 bg-gray-200 text-gray-400 cursor-not-allowed";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-background rounded-xl w-full max-w-2xl overflow-hidden shadow-xl">

        {/* Header */}
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <h2 className="text-white text-xl font-semibold">
            {isEditMode ? "Editar Usuario" : "Registrar Nuevo Usuario"}
          </h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full text-white flex items-center justify-center hover:bg-white/30 transition cursor-pointer"
          >
            <CircleX size={28} />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">

              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="first_name"
                  placeholder="Ej. Juan Antonio"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                  disabled={isEditMode}
                  className={`${inputBase} ${isEditMode ? inputDisabled : inputEnabled}`}
                />
              </div>

              {/* Apellido */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido *
                </label>
                <input
                  type="text"
                  name="last_name"
                  placeholder="Ej. Pérez Montejo"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                  disabled={isEditMode}
                  className={`${inputBase} ${isEditMode ? inputDisabled : inputEnabled}`}
                />
              </div>

              {/* Correo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Ej. tu@dominio.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={`${inputBase} ${inputEnabled}`}
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña *
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required={!isEditMode}
                  className={`${inputBase} ${inputEnabled}`}
                />
              </div>

              {/* Confirmar contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar contraseña *
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  placeholder="••••••••"
                  value={form.confirm_password}
                  onChange={handleChange}
                  required={!isEditMode}
                  className={`${inputBase} ${inputEnabled}`}
                />
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado de la cuenta
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={`${inputBase} ${inputEnabled} text-gray-600 appearance-none`}
                >
                  <option>Activo</option>
                  <option>Inactivo</option>
                </select>
              </div>

              {/* Rol */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol en el sistema
                </label>
                <select
                  name="id_role"
                  value={form.id_role}
                  onChange={handleChange}
                  className={`${inputBase} ${inputEnabled} text-gray-600 appearance-none`}
                >
                  <option>Vendedor</option>
                  <option>Administrador</option>
                </select>
              </div>

            </div>

            {/* Botones */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3 rounded-lg bg-danger text-white font-semibold text-base hover:bg-red-700 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-primary text-white font-semibold text-base hover:bg-secondary transition cursor-pointer"
              >
                {isEditMode ? "Actualizar" : "Registrar"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default UserModal;