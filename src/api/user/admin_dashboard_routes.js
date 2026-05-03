import { api } from "../axios";

export const getDashboardSummaryRequest = () =>
    api.get("/dashboard/summary");

export const getDashboardChartRequest = (period = "week") =>
    api.get("/dashboard/chart", { params: { period } });