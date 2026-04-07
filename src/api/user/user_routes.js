import { api } from "../axios";

export const getUsersRequest = () =>
    api.get("/users");

export const getUserRequest = (id) =>
    api.get(`/users/${id}`);

export const createUserRequest = (user) =>
    api.post("/users", user);

export const updateUserRequest = (id, user) =>
    api.put(`/users/${id}`, user);

export const deleteUserRequest = (id) =>
    api.delete(`/users/${id}`);