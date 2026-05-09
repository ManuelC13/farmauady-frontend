import { api } from "../axios";

export const createManualExitRequest = (data) =>
  api.post("/inventory/manual-exit", data);

export const getMovementsReportRequest = () =>
    api.get("/inventory/movements-report");