import { SquarePen, Trash2, ShieldCheck } from "lucide-react";

export const canDeleteUser = (currentUser, targetUser) => {
  return (
    currentUser?.id_user !== targetUser?.id_user &&
    targetUser?.role?.name !== "Administrador"
  );
};

function UserTable({ users, onEdit, onDelete, currentUser }) {
  return (
    <div className="bg-background overflow-hidden rounded-b-xl">
      <table className="w-full text-left">

        {/* Header */}
        <thead>
          <tr className="border-b border-gray-300">
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
            users.map((user) => {
              const canDelete = canDeleteUser(currentUser, user);

              return (
              <tr key={user.id_user} className="border-b border-gray-300 hover:bg-secondary/10 transition">

                {/* Usuario */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-md font-semibold shrink-0">
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
                    className="p-2 rounded-lg hover:bg-secondary/10 text-primary transition cursor-pointer"
                    title="Editar usuario"
                  >
                    <SquarePen size={22} />
                  </button>
                  {/*<button
                    onClick={() => onDelete(user)}
                    className="p-2 rounded-lg hover:bg-danger/10 text-danger transition cursor-pointer"
                    title="Eliminar usuario"
                  >
                    <Trash2 size={22} />
                  </button>*/}
                  <button
                    onClick={() => onDelete(user)}
                    disabled={!canDelete}
                    className={`p-2 rounded-lg transition cursor-pointer ${
                      canDelete
                        ? "hover:bg-danger/10 text-danger"
                        : "opacity-30 cursor-not-allowed text-gray-400"
                    }`}
                    title={
                      !canDelete
                        ? "No tienes permisos para eliminar este usuario"
                        : "Eliminar usuario"
                    }
                  >
                    <Trash2 size={22} />
                  </button>
                </td>

              </tr>
            )})
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;