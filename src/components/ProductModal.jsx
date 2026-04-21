import { useState, useEffect } from "react";
import { CircleX } from "lucide-react";
import { useCategories } from "../hooks/useCategories";

function ProductModal({ isOpen, onClose, onCreate, onUpdate, editingProduct }) {

  const initialForm = {
    name: "",
    id_category: "",
    sale_price: "",
    stock: "",
    expiration_date: "",
    active: "true",
    description: "",
    batch: "",
  };

  const isEditMode = !!editingProduct;
  const [form, setForm] = useState(initialForm);
  const { categories } = useCategories();

  useEffect(() => {
    if (editingProduct) {
      setForm({
        name:            editingProduct.name || "",
        id_category:     editingProduct.id_category || "",
        sale_price:      editingProduct.sale_price || "",
        stock:           editingProduct.stock ?? "",
        expiration_date: editingProduct.expiration_date || "",
        active:          String(editingProduct.active),
        description:     editingProduct.description || "",
        batch:           editingProduct.batch || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [editingProduct]);

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

    const payload = {
      name:            form.name,
      id_category:     Number(form.id_category),
      sale_price:      Number(form.sale_price),
      stock:           Number(form.stock),
      expiration_date: form.expiration_date,
      active:          form.active === "true",
      description:     form.description || null,
      batch:           form.batch || null,
    };

    if (isEditMode) {
      await onUpdate(editingProduct.id_product, payload);
    } else {
      await onCreate(payload);
    }

    handleClose();
  };

  const inputBase = "w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-400";
  const inputEnabled = "border-gray-400 bg-gray-100 placeholder-gray-400";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-background rounded-xl w-full max-w-2xl overflow-hidden shadow-xl">

        {/* Header */}
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <h2 className="text-white text-xl font-semibold">
            {isEditMode ? "Editar Medicamento" : "Registrar Nuevo Medicamento"}
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
                  Nombre comercial / compuesto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Ej. Paracetamol 500mg"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className={`${inputBase} ${inputEnabled}`}
                />
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <select
                  name="id_category"
                  value={form.id_category}
                  onChange={handleChange}
                  required
                  className={`${inputBase} ${inputEnabled} text-gray-600 appearance-none`}
                >
                  <option value="">Seleccionar</option>
                  {categories.map((cat) => (
                    <option key={cat.id_category} value={cat.id_category}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Precio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio unitario ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="sale_price"
                  placeholder="Ej. 25"
                  value={form.sale_price}
                  onChange={handleChange}
                  required
                  min={0}
                  step="0.01"
                  className={`${inputBase} ${inputEnabled}`}
                />
              </div>

              {/* Existencias */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Existencias iniciales <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  placeholder="Ej. 50"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  min={0}
                  className={`${inputBase} ${inputEnabled}`}
                />
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  name="active"
                  value={form.active}
                  onChange={handleChange}
                  className={`${inputBase} ${inputEnabled} text-gray-600 appearance-none`}
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>

              {/* Fecha de caducidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de caducidad del lote <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="expiration_date"
                  value={form.expiration_date}
                  onChange={handleChange}
                  required
                  className={`${inputBase} ${inputEnabled} text-gray-600`}
                />
              </div>

              {/* Lote */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lote <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  name="batch"
                  placeholder="Ej. LOTE-2024-A"
                  value={form.batch}
                  onChange={handleChange}
                  className={`${inputBase} ${inputEnabled}`}
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  name="description"
                  placeholder="Ej. Analgésico de uso común"
                  value={form.description}
                  onChange={handleChange}
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

export default ProductModal;