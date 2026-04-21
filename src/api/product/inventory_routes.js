import { api } from "../axios";

export const createManualExitRequest = (data) =>
  api.post("/inventory/manual-exit", data);