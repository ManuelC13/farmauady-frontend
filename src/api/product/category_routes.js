import { api } from "../axios";

export const getCategoriesRequest = () =>
    api.get("/categories");