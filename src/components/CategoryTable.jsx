import { SquarePen, Trash2 } from "lucide-react";

function CategoryTable({ categories, onEdit, onDelete }) {
  return (
    <div className="bg-background overflow-hidden rounded-b-xl">
      <table className="w-full text-left">

        {/* Header */}
        <thead>
          <tr className="border-b border-gray-300">
            <th className="py-4 px-6 text-sm font-semibold text-gray-800">Categoría</th>
            <th className="py-4 px-6 text-sm font-semibold text-gray-800 text-right">Acciones</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center py-10 text-gray-400 text-sm">
                No hay categorías registradas
              </td>
            </tr>
          ) : (
            categories.map((category) => (
              <tr key={category.id_category} className="border-b border-gray-300 hover:bg-secondary/10 transition">

                {/* Nombre */}
                <td className="py-4 px-6 text-sm font-medium text-gray-800">
                  {category.name}
                </td>

                {/* Acciones */}
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={() => onEdit(category)}
                    className="p-2 rounded-lg hover:bg-secondary/10 text-primary transition cursor-pointer"
                    title="Editar categoría"
                  >
                    <SquarePen size={22} />
                  </button>
                  <button
                    onClick={() => onDelete(category)}
                    className="p-2 rounded-lg hover:bg-danger/10 text-danger transition cursor-pointer"
                    title="Desactivar categoría"
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

export default CategoryTable;