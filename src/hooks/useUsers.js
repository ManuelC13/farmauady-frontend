import { useState, useEffect } from "react";
import { useToast } from "../context/ToastContext"
import { 
  createUserRequest, 
  getUsersRequest, 
  deleteUserRequest, 
  updateUserRequest 
} from "../api/user/user_routes";

const LIMIT = 10;

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const toast = useToast();

  const loadUsers = async (p = page) => {
    const res = await getUsersRequest(p, LIMIT);
    setUsers(res.data.data);
    setTotalPages(Math.ceil(res.data.total / LIMIT));
  };

  useEffect(() => { loadUsers(); }, [page]);

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

  return { users, page, totalPages, setPage, createUser, deleteUser, updateUser };
}