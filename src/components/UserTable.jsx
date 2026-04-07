import { SquarePen, Trash2, ShieldCheck } from "lucide-react";

function UserTable({ users, onEdit, onDelete }) {
  return (
    <div className="bg-background rounded-xl overflow-hidden shadow border border-gray-300">
      <table className="w-full text-left">

        {/* Header */}
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-4 px-6 text-sm font-semibold text-gray-800">Usuario</th>
            <th className="py-4 px-4 text-sm font-semibold text-gray-800">Rol</th>
            <th className="py-4 px-4 text-sm font-semibold text-gray-800">Correo electrónico</th>
            <th className="py-4 px-4 text-sm font-semibold text-gray-800">Estado</th>
            <th className="py-4 px-6 text-sm font-semibold text-gray-800 text-right">Acciones</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-10 text-gray-400 text-sm">
                No hay usuarios registrados
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="border-b border-gray-300 hover:bg-secondary/10 transition">

                {/* Usuario */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {user.first_name?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {user.first_name} {user.last_name}
                    </span>
                  </div>
                </td>

                {/* Rol */}
                <td className="py-4 px-4">
                  {user.role?.name === "Administrador" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm font-semibold">
                      <ShieldCheck size={18} />
                      Administrador
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-4 py-1 rounded-full bg-gray-300 text-gray-500 text-sm font-medium">
                      Vendedor
                    </span>
                  )}
                </td>

                {/* Correo */}
                <td className="py-4 px-4 text-sm text-gray-700">
                  {user.email}
                </td>

                {/* Estado */}
                <td className="py-4 px-4">
                  {user.status === "ACTIVO" ? (
                    <span className="inline-flex items-center px-4 py-1 rounded-full bg-green-100 text-green-600 text-sm font-medium">
                      {user.status}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-4 py-1 rounded-full bg-red-100 text-red-500 text-sm font-medium">
                      {user.status}
                    </span>
                  )}
                </td>

                {/* Acciones */}
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-2 rounded-lg hover:bg-secondary/10 text-primary transition"
                    title="Editar usuario"
                  >
                    <SquarePen size={20} />
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    className="p-2 rounded-lg hover:bg-danger/10 text-danger transition"
                    title="Eliminar usuario"
                  >
                    <Trash2 size={20} />
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

export default UserTable;