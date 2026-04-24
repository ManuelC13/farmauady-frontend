import { SquarePen, Trash2 } from "lucide-react";

const getStockStyle = (stock, minimumStock) => {
  if (stock <= minimumStock) {
    return "bg-red-100 text-red-500";
  }
  return "bg-purple-100 text-purple-600";
};

function ProductTable({ products, onEdit, onDelete }) {
  return (
    <div className="bg-background overflow-hidden rounded-b-xl">
      <table className="w-full text-left">

        {/* Header */}
        <thead>
          <tr className="border-b border-gray-300">
            <th className="py-4 px-6 text-xs font-semibold text-gray-800 tracking-wider uppercase">Sku</th>
            <th className="py-4 px-6 text-xs font-semibold text-gray-800 tracking-wider uppercase">Medicamento</th>
            <th className="py-4 px-6 text-xs font-semibold text-gray-800 tracking-wider uppercase">Categoría</th>
            <th className="py-4 px-6 text-xs font-semibold text-gray-800 tracking-wider uppercase">Precio</th>
            <th className="py-4 px-6 text-xs font-semibold text-gray-800 tracking-wider uppercase">Existencias</th>
            <th className="py-4 px-6 text-xs font-semibold text-gray-800 tracking-wider uppercase">Caducidad</th>
            <th className="py-4 px-6 text-xs font-semibold text-gray-800 tracking-wider uppercase">Estado</th>
            <th className="py-4 px-7 text-xs font-semibold text-gray-800 tracking-wider uppercase">Acciones</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-10 text-gray-400 text-sm">
                No hay productos registrados
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id_product} className="border-b border-gray-300 hover:bg-secondary/10 transition">

                {/* SKU */}
                <td className="py-4 px-6 text-sm font-medium text-gray-800">
                  {product.sku}
                </td>

                {/* Medicamento */}
                <td className="py-4 px-6 text-sm font-medium text-gray-800">
                  {product.name}
                </td>

                {/* Categoría */}
                <td className="py-4 px-6 text-sm text-gray-700">
                  {product.category?.name}
                </td>

                {/* Precio */}
                <td className="py-4 px-6 text-sm text-gray-700">
                  ${Number(product.sale_price).toFixed(2)}
                </td>

                {/* Existencias */}
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStockStyle(product.stock, product.minimum_stock)}`}>
                    {product.stock} u.
                  </span>
                </td>

                {/* Caducidad */}
                <td className="py-4 px-6 text-sm text-gray-700">
                  {product.expiration_date ?? (
                    <span className="text-gray-400 italic">No aplica</span>
                  )}
                </td>

                {/* Estado */}
                <td className="py-4 px-6">
                  {product.active ? (
                    <span className="inline-flex items-center px-4 py-1 rounded-full bg-green-100 text-green-600 text-sm font-medium">
                      Activo
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-4 py-1 rounded-full bg-red-100 text-red-500 text-sm font-medium">
                      Inactivo
                    </span>
                  )}
                </td>

                {/* Acciones */}
                <td className="py-4 px-6">
                  <button
                    onClick={() => onEdit(product)}
                    className="p-2 rounded-lg hover:bg-secondary/10 text-primary transition cursor-pointer"
                    title="Editar producto"
                  >
                    <SquarePen size={22} />
                  </button>
                  <button
                    onClick={() => onDelete(product)}
                    className="p-2 rounded-lg hover:bg-danger/10 text-danger transition cursor-pointer"
                    title="Eliminar producto"
                  >
                    <Trash2 size={22} />
                  </button>
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;