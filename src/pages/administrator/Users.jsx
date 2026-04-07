import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import UserTable from "../../components/UserTable";
import { useEffect, useState } from "react";
import { getUsersRequest, deleteUserRequest } from "../../api/user/user_routes";

function Users() {
  const [users, setUsers] = useState([]);

    // Obtener usuarios
  const loadUsers = async () => {
    const res = await getUsersRequest();
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Eliminar usuario
  const handleDelete = async (id) => {
    await deleteUserRequest(id);
    loadUsers(); // recargar lista
  };

  // Editar usuario
  const handleEdit = (user) => {
    console.log("Editar:", user);
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-6">
          <h1 className="text-xl font-bold mb-4">
            Gestión de usuarios
          </h1>

          <UserTable
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

      </div>
    </div>
  );
}

export default Users;