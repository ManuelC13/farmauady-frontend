import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { createManualExitRequest } from "../../api/product/inventory_routes";

const MOTIVOS = [
  { label: "Daño",       value: "SALIDA"     },
  { label: "Caducidad",  value: "CADUCIDAD"  },
  { label: "Devolución", value: "DEVOLUCION" },
];

const initialForm = {
  id_product: "",
  motivo: "",
  cantidad: "",
  observaciones: "",
};

function ManualExitModal({ isOpen, onClose, products }) {
  const [form, setForm] = useState(initialForm);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const selectedProduct = products.find(
    (p) => p.id_product === Number(form.id_product)
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleClose = () => {
    setForm(initialForm);
    setSearchQuery("");
    setError("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!form.id_product) return setError("Selecciona un medicamento.");
    if (!form.motivo) return setError("Selecciona un motivo.");
    if (!form.cantidad || Number(form.cantidad) <= 0)
      return setError("Ingresa una cantidad válida.");
    if (Number(form.cantidad) > selectedProduct?.stock)
      return setError(`La cantidad excede el stock disponible (${selectedProduct.stock} u.).`);

    try {
      setLoading(true);
      await createManualExitRequest({
        id_product:    Number(form.id_product),
        movement_type: form.motivo,
        quantity:      Number(form.cantidad),
        reason:        form.observaciones || null,
      });
      handleClose();
    } catch (e) {
      setError("Ocurrió un error al registrar la salida. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4">

        {/* Header */}
        <div className="flex items-center justify-between bg-primary text-white px-6 py-4 rounded-t-2xl">
          <h2 className="text-lg font-bold">Registrar Salida Manual de Inventario</h2>
          <button onClick={handleClose} className="hover:opacity-80 transition cursor-pointer">
            <X size={22} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">

          {/* Aviso */}
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm rounded-lg px-4 py-3">
            Utilice este formulario únicamente para registrar bajas por mermas (daños, caducidad o devoluciones).
            Para ventas, utilice el Punto de Venta.
          </div>

          {/* Buscador */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar medicamento por nombre o SKU"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Medicamento + Motivo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Medicamento <span className="text-red-500">*</span>
              </label>
              <select
                name="id_product"
                value={form.id_product}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Seleccione un medicamento</option>
                {filteredProducts.map((p) => (
                  <option key={p.id_product} value={p.id_product}>
                    {p.name} — {p.sku}
                  </option>
                ))}
              </select>
              {selectedProduct && (
                <span className="text-xs text-gray-400 mt-0.5">
                  Stock disponible: {selectedProduct.stock} u.
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Motivo <span className="text-red-500">*</span>
              </label>
              <select
                name="motivo"
                value={form.motivo}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Seleccionar</option>
                {MOTIVOS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cantidad */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Cantidad <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="cantidad"
              value={form.cantidad}
              onChange={handleChange}
              min={1}
              max={selectedProduct?.stock}
              placeholder="Ej. 5"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            />
          </div>

          {/* Observaciones */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Observaciones <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              rows={3}
              placeholder="Detalles adicionales sobre la merma..."
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {/* Botones */}
          <div className="grid grid-cols-2 gap-4 mt-1">
            <button
              onClick={handleClose}
              className="bg-danger text-white py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-primary text-white py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition cursor-pointer disabled:opacity-60"
            >
              {loading ? "Registrando..." : "Registrar"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ManualExitModal;