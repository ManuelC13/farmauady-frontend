import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { getSaleProductsRequest } from "../../api/product/product_routes";
import { reserveInventoryRequest, confirmSaleRequest, releaseReservationRequest } from "../../api/sales/sales_routes";
import { useToast } from "../../context/ToastContext";
import { generateTicketPDF } from "../../components/pdf/TicketPDF";
import NewSaleProductsPanel from "../../components/vendedor/NewSaleProductsPanel";
import NewSaleCartPanel from "../../components/vendedor/NewSaleCartPanel";

function NewSale() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("farmauady_cart");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [lastSale, setLastSale] = useState(null);
  const toast = useToast();

  const [cartSessionId] = useState(() => {
    const saved = localStorage.getItem("farmauady_cart_session");
    if (saved) return saved;
    const newId = crypto.randomUUID();
    localStorage.setItem("farmauady_cart_session", newId);
    return newId;
  });

  const [reservationExpiry, setReservationExpiry] = useState(() => {
    const saved = localStorage.getItem("farmauady_cart_expiry");
    if (saved) {
      const expiryDate = new Date(saved);
      if (expiryDate > new Date()) return expiryDate;
    }
    return null;
  });
  const [countdown, setCountdown] = useState(null);
  const countdownRef = useRef(null);
  const [reserving, setReserving] = useState(false);
  const reserveTimerRef = useRef(null);
  const lastReservedCartStr = useRef(JSON.stringify(cart));
  const wsRef = useRef(null);
  const searchRef = useRef(search);

  const fetchProducts = async (searchTerm = "", isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const response = await getSaleProductsRequest(searchTerm, cartSessionId, true);
      const pList = Array.isArray(response.data) ? response.data : (response.data?.data || response.data?.products || []);
      const mappedProducts = pList.map((p) => ({
        id: p.id_product,
        name: p.name,
        category: p.category_name,
        price: parseFloat(p.sale_price),
        stock: p.stock,
      }));
      setProducts(mappedProducts);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  useEffect(() => {
    fetchProducts(search);
  }, [search]);

  //Sincronizar carrito con localStorage
  useEffect(() => {
    localStorage.setItem("farmauady_cart", JSON.stringify(cart));
  }, [cart]);

  //Sincronizar expiración con localStorage
  useEffect(() => {
    if (reservationExpiry) {
      localStorage.setItem("farmauady_cart_expiry", reservationExpiry.toISOString());
    } else {
      localStorage.removeItem("farmauady_cart_expiry");
    }
  }, [reservationExpiry]);

  //WebSocket: conexión persistente para recibir actualizaciones de inventario en tiempo real
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
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      setCart((prevCart) => {
        let changed = false;
        const newCart = prevCart.map(item => {
          const p = products.find(prod => prod.id === item.id);
          if (p && item.quantity > p.stock) {
            changed = true;
            return { ...item, quantity: p.stock };
          }
          return item;
        }).filter(item => item.quantity > 0);
        
        return changed ? newCart : prevCart;
      });
    }
  }, [products]);

  //Cuenta regresiva: arranca cuando hay una reserva activa
  useEffect(() => {
    if (!reservationExpiry) {
      setCountdown(null);
      if (countdownRef.current) clearInterval(countdownRef.current);
      return;
    }

    const tick = () => {
      const diff = Math.max(0, Math.floor((reservationExpiry - Date.now()) / 1000));
      const m = String(Math.floor(diff / 60)).padStart(2, "0");
      const s = String(diff % 60).padStart(2, "0");
      setCountdown(`${m}:${s}`);
      if (diff === 0) {
        clearInterval(countdownRef.current);
        setReservationExpiry(null);
        setCountdown(null);
        setCart([]); // Limpiar carrito al expirar
        toast.error("La reserva expiró. El carrito ha sido vaciado.");
      }
    };

    tick();
    countdownRef.current = setInterval(tick, 1000);
    return () => clearInterval(countdownRef.current);
  }, [reservationExpiry]);

  
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
          ttl_minutes: 15,    //<- Reserva por 15 minutos los productos del carrito
        });
        
        const raw = res.data.expires_at;
        const utcString = raw.endsWith("Z") ? raw : raw + "Z";
        setReservationExpiry(new Date(utcString));
        
        lastReservedCartStr.current = currentCartStr;

      } catch (error) {
        const detail =
          error?.response?.data?.detail ||
          "No se pudo reservar el stock. Intenta de nuevo.";
        toast.error(detail);
        fetchProducts(search);
      } finally {
        setReserving(false);
      }
    }, 600);

    return () => clearTimeout(reserveTimerRef.current);
  }, [cart]);


  // Cantidad en carrito de un producto
  const cartQty = (productId) =>
    cart.find((i) => i.id === productId)?.quantity ?? 0;

  const addToCart = (product) => {
    const inCart = cartQty(product.id);
    if (inCart >= product.stock) return; // no exceder stock real
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Aumenta la cantidad en el carrito (respeta el stock)
  const increaseQty = (item) => {
    if (item.quantity >= item.stock) return;
    setCart((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
    );
  };

  // Disminuye la cantidad; si llega a 0, elimina del carrito
  const decreaseQty = (item) => {
    setCart((prev) =>
      item.quantity <= 1
        ? prev.filter((i) => i.id !== item.id)
        : prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i))
    );
  };

  // Edita la cantidad directamente con eñ input numérico
  const updateQty = (item, value) => {
    const qty = Math.max(1, Math.min(item.stock, parseInt(value) || 1));
    setCart((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, quantity: qty } : i))
    );
  };

  // Elimina el producto completo del carrito
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchProducts(value);
  };

  const handleConfirmSale = async () => {
    if (cart.length === 0) return;
    setConfirming(true);
    try {
      const response = await confirmSaleRequest({
        cart_session_id: cartSessionId,
        payment_method: "efectivo",
      });

      const sale = response.data;
      setLastSale(sale);
      setCart([]);
      setReservationExpiry(null);
      localStorage.removeItem("farmauady_cart");
      localStorage.removeItem("farmauady_cart_expiry");
      toast.success(
        `Venta #${sale.folio} registrada por $${parseFloat(sale.total).toFixed(2)}`
      );
      fetchProducts(search);
    } catch (error) {
      const detail =
        error?.response?.data?.detail ||
        "Error al registrar la venta. Intenta de nuevo.";
        toast.error("Error al registrar la venta. Intenta de nuevo.");
      toast.error(detail);
    } finally {
      setConfirming(false);
    }
  };

  // Genera y descarga el PDF del ticket de venta
  const handlePrintTicket = async () => {
    if (!lastSale) return;
    try {
      const blob = await generateTicketPDF(lastSale);
      if (!blob) throw new Error("Error al generar PDF");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Ticket_${lastSale.folio}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`Ticket #${lastSale.folio} descargado correctamente`);
      setLastSale(null); // Limpia para que el botón vuelva a desactivarse
    } catch (error) {
      console.error("Error al generar el ticket PDF:", error);
      toast.error("No se pudo generar el ticket. Intenta de nuevo.");
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[#F8FAFC]">
      <div className="flex-none">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />

        <main className="flex-1 flex flex-col p-8 min-h-0 overflow-hidden">
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
            <NewSaleProductsPanel
              products={products}
              loading={loading}
              search={search}
              onSearchChange={handleSearchChange}
              onAddToCart={addToCart}
              cartQty={cartQty}
            />

            <NewSaleCartPanel
              cart={cart}
              total={total}
              totalItems={totalItems}
              countdown={countdown}
              reserving={reserving}
              confirming={confirming}
              lastSale={lastSale}
              onIncreaseQty={increaseQty}
              onDecreaseQty={decreaseQty}
              onUpdateQty={updateQty}
              onRemoveFromCart={removeFromCart}
              onConfirmSale={handleConfirmSale}
              onPrintTicket={handlePrintTicket}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default NewSale;