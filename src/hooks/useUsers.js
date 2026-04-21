import { useState, useEffect } from "react";
import { useToast } from "../context/ToastContext"
import { 
  createUserRequest, 
  getUsersRequest, 
  deleteUserRequest, 
  updateUserRequest 
} from "../api/user/user_routes";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const toast = useToast();

  const loadUsers = async () => {
    const res = await getUsersRequest();
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const createUser = async (data) => {
    try {
      await createUserRequest(data);
      await loadUsers();
      toast.success("Usuario creado exitosamente");
    } catch (error) {
      const message = error.response?.data?.detail || "Ocurrió un error al crear al usuario";
      toast.error(message);
    }
  };

  const deleteUser = async (id) => {
    try {
      await deleteUserRequest(id);
      await loadUsers();
      toast.success("Usuario eliminado exitosamente");
    } catch (error) {
      const message = error.response?.data?.detail || "Ocurrió un error al eliminar al usuario";
      toast.error(message);
    }
  };

  const updateUser = async (id, data) => {
    try {
      await updateUserRequest(id, data);
      await loadUsers();
      toast.success("Usuario actualizado exitosamente");
    } catch (error) {
      const message = error.response?.data?.detail || "Ocurrió un error al actualizar al usuario";
      toast.error(message);
    }
  };

  return { users, createUser, deleteUser, updateUser };
}