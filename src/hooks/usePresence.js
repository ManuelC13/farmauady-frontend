import { usePresence } from "../context/PresenceContext";

/**
 * Hook para consumir el estado de presencia desde cualquier componente.
 * 
 * Retorna:
 * - onlineUsers: array de IDs de usuarios conectados
 * - isPresenceConnected: boolean indicando si el socket está conectado
 * - onlineCount: número total de usuarios conectados
 * - isUserOnline(userId): función para verificar si un usuario específico está online
 * 
 * Ejemplo:
 * const { onlineUsers, isUserOnline, onlineCount } = usePresence();
 */
export function usePresenceStatus() {
    return usePresence();
}

export { usePresence };
