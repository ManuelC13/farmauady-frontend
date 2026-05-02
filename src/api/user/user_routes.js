import { api } from "../axios";

export const getUsersRequest = (page = 1, limit = 10) =>
    api.get("/users/", { params: { page, limit } });

export const updateOwnProfileRequest = (user) =>
    api.put("/users/me", user);

export const getUserRequest = (id) =>
    api.get(`/users/${id}`);

export const createUserRequest = (user) =>
    api.post("/users/", user);

export const updateUserRequest = (id, user) =>
    api.put(`/users/${id}`, user);

export const deleteUserRequest = (id) =>
    api.delete(`/users/${id}`);

export const changePasswordRequest = (data) =>
    api.patch("/users/me/change-password", data);
