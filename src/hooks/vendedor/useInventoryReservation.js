import { useEffect, useRef, useState } from "react";
import { reserveInventoryRequest, releaseReservationRequest } from "../../api/sales/sales_routes";
import { useToast } from "../../context/ToastContext";

const EXPIRY_STORAGE_KEY = "farmauady_cart_expiry";

function getSavedExpiry() {
  const saved = localStorage.getItem(EXPIRY_STORAGE_KEY);
  if (!saved) return null;

  const expiryDate = new Date(saved);
  if (expiryDate > new Date()) return expiryDate;
  return null;
}

export function useInventoryReservation(cartSessionId, cart, fetchProducts, search) {
  const [reservationExpiry, setReservationExpiry] = useState(() => getSavedExpiry());
  const [countdown, setCountdown] = useState(null);
  const [reserving, setReserving] = useState(false);

  const toast = useToast();
  const countdownRef = useRef(null);
  const reserveTimerRef = useRef(null);
  const lastReservedCartStr = useRef(JSON.stringify(cart));

  //Sincroniza la expiración con el localStorage
  useEffect(() => {
    if (reservationExpiry) {
      localStorage.setItem(EXPIRY_STORAGE_KEY, reservationExpiry.toISOString());
    } else {
      localStorage.removeItem(EXPIRY_STORAGE_KEY);
    }
  }, [reservationExpiry]);

  //Contador regresivo para la expiración de la reserva
  useEffect(() => {
    if (!reservationExpiry) {
      setCountdown(null);
      if (countdownRef.current) clearInterval(countdownRef.current);
      return;
    }

    //Funciín que sirve para actualizar el contador
    const tick = () => {
      const diff = Math.max(0, Math.floor((reservationExpiry - Date.now()) / 1000));
      const minutes = String(Math.floor(diff / 60)).padStart(2, "0");
      const seconds = String(diff % 60).padStart(2, "0");
      setCountdown(`${minutes}:${seconds}`);

      if (diff === 0) {
        clearInterval(countdownRef.current);
        setReservationExpiry(null);
        setCountdown(null);
        toast.error("La reserva expiró. El carrito ha sido vaciado.");
      }
    };

    tick();
    countdownRef.current = setInterval(tick, 1000);
    return () => clearInterval(countdownRef.current);
  }, [reservationExpiry]);

  //Reserva de inventario cada vez que el carrito cambia, con el debounce
  useEffect(() => {
    if (reserveTimerRef.current) clearTimeout(reserveTimerRef.current);

    const currentCartStr = JSON.stringify(cart);

    if (currentCartStr === lastReservedCartStr.current && reservationExpiry) {
      return;
    }

    if (cart.length === 0) {
      releaseReservationRequest(cartSessionId).catch(() => {});
      setReservationExpiry(null);
      lastReservedCartStr.current = currentCartStr;
      return;
    }

    reserveTimerRef.current = setTimeout(async () => {
      setReserving(true);
      try {
        const res = await reserveInventoryRequest({
          cart_session_id: cartSessionId,
          items: cart.map((item) => ({
            id_product: item.id,
            quantity: item.quantity,
          })),
          ttl_minutes: 15,
        });

        const raw = res.data.expires_at;
        const utcString = raw.endsWith("Z") ? raw : `${raw}Z`;
        setReservationExpiry(new Date(utcString));
        lastReservedCartStr.current = currentCartStr;
      } catch (error) {
        const detail = error?.response?.data?.detail || "No se pudo reservar el stock. Intenta de nuevo.";
        toast.error(detail);
        fetchProducts(search);
      } finally {
        setReserving(false);
      }
    }, 600);

    return () => clearTimeout(reserveTimerRef.current);
  }, [cart, cartSessionId, fetchProducts, search]);

  return {
    reservationExpiry,
    setReservationExpiry,
    countdown,
    reserving,
  };
}
