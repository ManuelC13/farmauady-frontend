import { api } from "../axios";

export const createSaleRequest = (payload) =>
    api.post("/sales/create", payload);

export const getRecentSalesRequest = (limit = 5) =>
    api.get(`/sales/recent?limit=${limit}`);

export const getAllSalesRequest = () =>
    api.get("/sales/all");
