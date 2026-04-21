import { api } from "../axios";

export const createSaleRequest = (payload) =>
    api.post("/sales/create", payload);

export const getRecentSalesRequest = (limit = 5) =>
    api.get(`/sales/recent?limit=${limit}`);

// Para el vendedor — solo sus ventas
export const getMySalesRequest = () =>
    api.get("/sales/my-sales");

// Para el admin — todas las ventas
export const getAllSalesAdminRequest = () =>
    api.get("/sales/all");