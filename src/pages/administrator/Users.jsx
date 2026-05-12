import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useUsers } from "../../hooks/useUsers";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import UserTable from "../../components/user/UserTable";
import UserModal from "../../components/user/UserModal";
import ConfirmModal from "../../components/common/modals/ConfirmModal";
import Pagination from "../../components/layout/Pagination";
import { Plus, Search } from "lucide-react";

function Users() {
  const { users, page, totalPages, setPage, applySearch, createUser, deleteUser, updateUser } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
  const [deletingUser, setDeletingUser] = useState(null); 
  const [submitting, setSubmitting] = useState(false);
  const { user: currentUser } = useAuth();


  // Filtrado local de usuarios
  /*const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const email = user.email?.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    return fullName.includes(query) || email.includes(query);
  });*/

  useEffect(() => {
    const timeout = setTimeout(() => applySearch(searchQuery), 400);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const editUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setDeletingUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingUser(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-background min-h-screen">
        <Navbar />

        <div className="p-6 px-10 pt-7">
          <h1 className="text-3xl font-bold mt-2 mb-1">
            Gestión de usuarios
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            Control de personal y acceso al sistema FarmaUady.
          </p>

          <div className="rounded-xl shadow border border-gray-300 my-5"> 
            <div className="flex items-center justify-between gap-4 bg-lightBlue p-6 rounded-t-xl">
              {/* Barra de búsqueda */}
              <div className="relative w-full max-w-md">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o correo"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {/* Botón nuevo usuario */}
              <button
                onClick={() => {
                  setEditingUser(null);
                  setIsModalOpen(true);
                }}
                className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 whitespace-nowrap text-sm font-medium"
              >
                <Plus size={18} /> Registrar usuario
              </button>
            </div>

            <UserModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onCreate={async (payload) => {
                setSubmitting(true);
                try { await createUser(payload); } finally { setSubmitting(false); }
              }}
              onUpdate={async (id, payload) => {
                setSubmitting(true);
                try { await updateUser(id, payload); } finally { setSubmitting(false); }
              }}
              editingUser={editingUser}
              submitting={submitting}
            />

            <ConfirmModal
              isOpen={isDeleteModalOpen}
              onClose={handleCloseDeleteModal}
              onConfirm={deleteUser}
              itemId={deletingUser?.id_user}
              title="Eliminar Usuario"
              message={`¿Estás seguro de que deseas eliminar a ${deletingUser?.first_name} ${deletingUser?.last_name}? Su cuenta quedará inactiva y no podrá acceder al sistema.`}
            />

            <UserTable
              users={users}
              onEdit={editUser}
              onDelete={handleDeleteClick}
              currentUser={currentUser}
            />

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Users;