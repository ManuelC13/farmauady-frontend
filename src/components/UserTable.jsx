import { Pencil, Trash2 } from "lucide-react";

function UserTable({ users, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <table className="w-full text-left">
        
        {/* Header */}
        <thead>
          <tr className="text-gray-500 text-sm border-b">
            <th className="py-3">Usuario</th>
            <th>Rol</th>
            <th>Correo electrónico</th>
            <th>Estado</th>
            <th className="text-right">Acciones</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-6 text-gray-400">
                No hay usuarios
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-3 font-medium">{user.first_name} {user.last_name}</td>
                <td>{user.role?.name}</td>
                <td>{user.email}</td>
                <td>{user.status}</td>

                {/* Acciones */}
                <td className="text-right">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(user.id)}
                    className="p-2 hover:bg-red-100 rounded text-red-500"
                  >
                    <Trash2 size={18} />
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