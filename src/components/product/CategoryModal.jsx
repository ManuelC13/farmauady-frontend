import { useState, useEffect } from "react";
import { CircleX } from "lucide-react";

function CategoryModal({ isOpen, onClose, onCreate, onUpdate, editingCategory }) {
  const initialForm = { name: "" };
  const isEditMode = !!editingCategory;
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (editingCategory) {
      setForm({ name: editingCategory.name || "" });
    } else {
      setForm(initialForm);
    }
  }, [editingCategory]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setForm(initialForm);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { name: form.name };

    if (isEditMode) {
      await onUpdate(editingCategory.id_category, payload);
    } else {
      await onCreate(payload);
    }

    handleClose();
  };

  const inputBase = "w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-400";
  const inputEnabled = "border-gray-400 bg-gray-100 placeholder-gray-400";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-background rounded-xl w-full max-w-md overflow-hidden shadow-xl">

        {/* Header */}
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <h2 className="text-white text-xl font-semibold">
            {isEditMode ? "Editar Categoría" : "Nueva Categoría"}
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
            <div className="flex flex-col gap-4">

              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la categoría <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Ej. Analgésico"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className={`${inputBase} ${inputEnabled}`}
                />
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

export default CategoryModal;