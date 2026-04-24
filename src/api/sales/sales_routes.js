import { api } from "../axios";

export const getRecentSalesRequest = (limit = 5) =>
    api.get(`/sales/recent?limit=${limit}`);

export const getDailyStatsRequest = () =>
    api.get("/sales/stats/daily");

// Para el vendedor — solo sus ventas
export const getMySalesRequest = () =>
    api.get("/sales/my-sales");

// Para el admin — todas las ventas
export const getAllSalesAdminRequest = () =>
    api.get("/sales/all");

export const getFilteredSalesRequest = (params) =>
    api.get("/sales/filtered", { params });

//__________________________________________
//Endpoints para reservaciones de productos
//__________________________________________
export const reserveInventoryRequest = (payload) =>
    api.post("/sales/reserve", payload);

export const confirmSaleRequest = (payload) =>
    api.post("/sales/confirm", payload);

export const releaseReservationRequest = (cartSessionId) =>
    api.delete(`/sales/reserve/${cartSessionId}`);