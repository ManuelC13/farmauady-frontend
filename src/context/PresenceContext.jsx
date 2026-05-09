import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useAuth } from "./AuthContext";

export const PresenceContext = createContext();

export const usePresence = () => {
    const context = useContext(PresenceContext);
    if (!context) {
        throw new Error("usePresence debe usarse dentro de un PresenceProvider");
    }
    return context;
};

export const PresenceProvider = ({ children }) => {
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [isPresenceConnected, setIsPresenceConnected] = useState(false);
    const wsRef = useRef(null);
    const heartbeatIntervalRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const shouldReconnectRef = useRef(false);
    const { isAuthenticated } = useAuth();

    //Conecta al WebSocket de presencia
    const connectPresence = useCallback(() => {
        if (!isAuthenticated) {
            return;
        }

        const currentSocket = wsRef.current;
        if (currentSocket && (currentSocket.readyState === WebSocket.OPEN || currentSocket.readyState === WebSocket.CONNECTING)) {
            return;
        }

        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
        const wsUrl = apiUrl.replace(/^http/, "ws") + "/ws/presence";

        try {
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log("Conectado al WebSocket de presencia");
                setIsPresenceConnected(true);
                //Solicita la lista inicial de usuarios online
                ws.send("GET_ONLINE");
                //Inicia el heartbeat cada 45 segundos
                heartbeatIntervalRef.current = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send("PING");
                    }
                }, 45000);
            };

            ws.onmessage = (event) => {
                const message = event.data;
                
                if (message === "PONG") {
                    //Respuesta al heartbeat, no hacer nada
                } else if (message.startsWith("ONLINE_USERS:")) {
                    //Actualiza lista de usuarios online
                    const usersStr = message.substring("ONLINE_USERS:".length);
                    const users = usersStr ? usersStr.split(",").map(Number) : [];
                    setOnlineUsers(users);
                }
            };

            ws.onclose = () => {
                console.log("Desconectado del WebSocket de presencia");
                setIsPresenceConnected(false);
                if (heartbeatIntervalRef.current) {
                    clearInterval(heartbeatIntervalRef.current);
                    heartbeatIntervalRef.current = null;
                }

                wsRef.current = null;

                // Reintenta solo si en la app sigue autenticada y la desconexión no fue manual
                if (shouldReconnectRef.current && isAuthenticated) {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connectPresence();
                    }, 5000);
                }
            };

            ws.onerror = (error) => {
                console.error("Error en WebSocket de presencia:", error);
                setIsPresenceConnected(false);
                if (heartbeatIntervalRef.current) {
                    clearInterval(heartbeatIntervalRef.current);
                    heartbeatIntervalRef.current = null;
                }
            };
        } catch (error) {
            console.error("Error al conectar WebSocket de presencia:", error);
            setIsPresenceConnected(false);
        }
    }, [isAuthenticated]);

    // Desconecta del WebSocket de presencia
    const disconnectPresence = useCallback(() => {
        shouldReconnectRef.current = false;

        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
            heartbeatIntervalRef.current = null;
        }

        const currentSocket = wsRef.current;
        if (currentSocket && (currentSocket.readyState === WebSocket.OPEN || currentSocket.readyState === WebSocket.CONNECTING)) {
            currentSocket.close();
        }

        wsRef.current = null;
        setIsPresenceConnected(false);
        setOnlineUsers([]);
    }, []);

    //Conecta cuando se autentica, desconectarse cuando se desautentica
    useEffect(() => {
        if (isAuthenticated) {
            shouldReconnectRef.current = true;
            connectPresence();
        } else {
            disconnectPresence();
        }

        return () => {
            shouldReconnectRef.current = false;

            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }

            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
                heartbeatIntervalRef.current = null;
            }

            const currentSocket = wsRef.current;
            if (currentSocket && (currentSocket.readyState === WebSocket.OPEN || currentSocket.readyState === WebSocket.CONNECTING)) {
                currentSocket.close();
            }

            wsRef.current = null;
        };
    }, [isAuthenticated, connectPresence, disconnectPresence]);

    //Helper: verificar si un usuario está online
    const isUserOnline = useCallback((userId) => {
        return onlineUsers.includes(userId);
    }, [onlineUsers]);

    const value = useMemo(() => ({
        onlineUsers,
        isPresenceConnected,
        onlineCount: onlineUsers.length,
        connectPresence,
        disconnectPresence,
        isUserOnline
    }), [onlineUsers, isPresenceConnected, connectPresence, disconnectPresence, isUserOnline]);

    return (
        <PresenceContext.Provider value={value}>
            {children}
        </PresenceContext.Provider>
    );
};
