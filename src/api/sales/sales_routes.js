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

//Endpoints para reservaciones de productos
//Reserva los productos del carrito por 15 minutos
export const reserveInventoryRequest = (payload) =>
    api.post("/sales/reserve", payload);

//Confirma la venta sobre las reservaciones activas
export const confirmSaleRequest = (payload) =>
    api.post("/sales/confirm", payload);

//Libera las reservaciones si el vendedor elimina todos los productos del carrito o se vence el tiempo
export const releaseReservationRequest = (cartSessionId) =>
    api.delete(`/sales/reserve/${cartSessionId}`);