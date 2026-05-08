import { useSearchParams } from "react-router-dom";
import { useProductCatalog } from "./useProductCatalog";
import { useCartManager } from "./useCartManager";
import { usePaymentMethod } from "./usePaymentMethod";
import { useWebSocketInventory } from "./useWebSocketInventory";
import { useInventoryReservation } from "./useInventoryReservation";
import { useSaleConfirmation } from "./useSaleConfirmation";

const SESSION_STORAGE_KEY = "farmauady_cart_session";

function getSavedSessionId() {
  const saved = localStorage.getItem(SESSION_STORAGE_KEY);
  if (saved) return saved;

  const newId = crypto.randomUUID();
  localStorage.setItem(SESSION_STORAGE_KEY, newId);
  return newId;
}

export function useNewSale() {
  const [searchParams] = useSearchParams();
  const cartSessionId = getSavedSessionId();

  //Inicializa el buscador de productos desde URL
  const initialSearch = searchParams.get("search") || "";

  //Productos y búsqueda
  const { products, search, loading, handleSearchChange, fetchProducts, searchRef } =
    useProductCatalog(cartSessionId, initialSearch);

  //Carrito
  const { cart, cartQty, addToCart, increaseQty, decreaseQty, updateQty, removeFromCart, clearCart, total, totalItems } =
    useCartManager(products);

  // Método de pago
  const { paymentMethod, setPaymentMethod } = usePaymentMethod();

  // WebSocket para actualizaciones de inventario
  useWebSocketInventory(fetchProducts, searchRef);

  // Reserva de inventario
  const { reservationExpiry, setReservationExpiry, countdown, reserving } =
    useInventoryReservation(cartSessionId, cart, fetchProducts, search);

  // Confirmación de venta
  const { confirming, lastSale, handleConfirmSale: confirmSale, handlePrintTicket } =
    useSaleConfirmation();

  // Wrapper para handleConfirmSale que sirve para limpiar estados
  const handleConfirmSale = async () => {
    await confirmSale(cartSessionId, paymentMethod, (sale) => {
      clearCart();
      setReservationExpiry(null);
      localStorage.removeItem("farmauady_cart_expiry");
      fetchProducts(search);
    });
  };

  return {
    products,
    cart,
    search,
    loading,
    confirming,
    lastSale,
    paymentMethod,
    setPaymentMethod,
    countdown,
    reserving,
    cartQty,
    addToCart,
    increaseQty,
    decreaseQty,
    updateQty,
    removeFromCart,
    handleSearchChange,
    handleConfirmSale,
    handlePrintTicket,
    total,
    totalItems,
  };
}