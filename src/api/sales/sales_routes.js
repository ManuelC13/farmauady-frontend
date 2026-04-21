import { api } from "../axios";

/**
 * Crea una nueva venta en el backend.
 * @param {Object} payload - { items: [{ id_product, quantity }], payment_method? }
 */
export const createSaleRequest = (payload) =>
    api.post("/sales/create", payload);
