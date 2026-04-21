import { api } from "../axios";

export const getProductsRequest = (search = "") =>
    api.get("/products/sale", {
        params: { search }
    });
