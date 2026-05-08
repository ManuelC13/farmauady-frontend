import { useEffect, useRef } from "react";

export function useWebSocketInventory(fetchProducts, searchRef) {
  const wsRef = useRef(null);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
    const wsUrl = apiUrl.replace(/^http/, "ws") + "/ws/inventory";
    let destroyed = false;
    let reconnectTimeout = null;
    let ws = null;

    const connect = () => {
      if (destroyed) return;

      ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        if (event.data === "INVENTORY_UPDATE") {
          fetchProducts(searchRef.current, true);
        }
      };

      ws.onclose = () => {
        if (!destroyed) {
          reconnectTimeout = setTimeout(connect, 3000);
        }
      };

      ws.onerror = () => {
      };
    };

    const initialTimeout = setTimeout(connect, 200);

    return () => {
      destroyed = true;
      clearTimeout(initialTimeout);
      clearTimeout(reconnectTimeout);
      if (ws) {
        ws.onclose = null;
        ws.onerror = null;
        ws.onmessage = null;
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.close();
        }
      }
      wsRef.current = null;
    };
  }, [fetchProducts]);

  return { wsRef };
}
