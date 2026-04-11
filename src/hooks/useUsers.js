import { useState, useEffect } from "react";
import { createUserRequest, getUsersRequest, deleteUserRequest, updateUserRequest } from "../api/user/user_routes";

export function useUsers() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const res = await getUsersRequest();
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const createUser = async (data) => {
    await createUserRequest(data);
    await loadUsers();
  };

  const deleteUser = async (id) => {
    await deleteUserRequest(id);
    await loadUsers();
  };

  const updateUser = async (id, data) => {
    await updateUserRequest(id, data);
    await loadUsers();
  };

  return { users, createUser, deleteUser, updateUser };
}