import { api } from "../axios";

export const loginRequest = (email, password) =>
    api.post("/auth/login", { email, password });

export const logoutRequest = () =>
    api.post("/auth/logout");

export const refreshTokenRequest = () =>
    api.post("/auth/refresh");

export const forgotPasswordRequest = (email) =>
    api.post("/auth/forgot-password", { email });

export const resetPasswordRequest = (token, new_password, confirm_password) =>
    api.post("/auth/reset-password", { token, new_password, confirm_password });