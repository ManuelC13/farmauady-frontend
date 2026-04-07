import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import UserTable from "../../components/UserTable";
import UserModal from "../../components/UserModal";
import ConfirmModal from "../../components/ConfirmModal";
import { useEffect, useState } from "react";
import { createUserRequest, getUsersRequest, deleteUserRequest, updateUserRequest } from "../../api/user/user_routes";
import { Plus } from "lucide-react";

function Users() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
  const [deletingUser, setDeletingUser] = useState(null); 

  const loadUsers = async () => {
    const res = await getUsersRequest();
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const createUser = async (data) => {
    await createUserRequest(data);
    loadUsers(); 
  };

  const deleteUser = async (id) => {
    await deleteUserRequest(id);
    loadUsers(); 
  };

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

  const updateUser = async (id, data) => {
    await updateUserRequest(id, data);
    loadUsers();
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

        <div className="p-6">
          <h1 className="text-xl font-bold mb-4">
            Gestión de usuarios
          </h1>

          <button
            onClick={() => {
              setEditingUser(null);
              setIsModalOpen(true);
            }}
            className="mb-4 bg-primary text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2"
          >
            <Plus/> Registrar usuario
          </button>

          <UserModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onCreate={createUser}
            onUpdate={updateUser}
            editingUser={editingUser}
          />

          <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            onConfirm={deleteUser}
            user={deletingUser}
          />

          <UserTable
            users={users}
            onEdit={editUser}
            onDelete={handleDeleteClick}
          />
        </div>

      </div>
    </div>
  );
}

export default Users;