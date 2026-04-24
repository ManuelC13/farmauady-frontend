import { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import ProductCard from "../../components/ProductCard";
import { Search, FileText, ShoppingCart, X, Receipt, Plus, Minus, Trash2, Loader2, Package, Clock } from "lucide-react";
import { getSaleProductsRequest } from "../../api/product/product_routes";
import { reserveInventoryRequest, confirmSaleRequest, releaseReservationRequest } from "../../api/sales/sales_routes";
import { useToast } from "../../context/ToastContext";
import { generateTicketPDF } from "../../components/pdf/TicketPDF";

function NewSale() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [lastSale, setLastSale] = useState(null);
  const toast = useToast();

  const [cartSessionId] = useState(() => crypto.randomUUID());

  const [reservationExpiry, setReservationExpiry] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const countdownRef = useRef(null);
  const [reserving, setReserving] = useState(false);
  const reserveTimerRef = useRef(null);

  const fetchProducts = async (searchTerm = "") => {
    setLoading(true);
    try {
      const response = await getSaleProductsRequest(searchTerm);
      const mappedProducts = response.data.products.map((p) => ({
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
        toast.error("La reserva expiró. Vuelve a agregar productos al carrito.");
      }
    };

    tick();
    countdownRef.current = setInterval(tick, 1000);
    return () => clearInterval(countdownRef.current);
  }, [reservationExpiry]);

  
  useEffect(() => {
    if (reserveTimerRef.current) clearTimeout(reserveTimerRef.current);

    if (cart.length === 0) {
      // Carrito vacío: liberar reservas del backend silenciosamente
      releaseReservationRequest(cartSessionId).catch(() => {});
      setReservationExpiry(null);
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

      } catch (error) {
        const detail =
          error?.response?.data?.detail ||
          "No se pudo reservar el stock. Intenta de nuevo.";
        toast.error(detail);
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
            
            {/* Sección de Productos (Izquierda) */}
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col min-h-0 overflow-hidden">
              
              {/* Header Nueva Venta */}
              <div className="p-6 bg-[#E9F4FF] border-b border-blue-100 flex items-center justify-between h-[88px]">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2.5 rounded-xl shadow-sm text-blue-600">
                    <FileText size={26} strokeWidth={2.5} />
                  </div>
                  <h1 className="text-2xl font-black text-blue-600 tracking-tight">
                    Nueva Venta
                  </h1>
                </div>
                <div className="bg-blue-100/50 px-4 py-1.5 rounded-full border border-blue-200/50">
                  <span className="text-blue-600 font-bold text-xs uppercase tracking-tight">
                    {products.length} Productos disponibles
                  </span>
                </div>
              </div>

              {/* Barra de Búsqueda y Descripción */}
              <div className="px-8 mt-8 mb-4 flex flex-col gap-4">
                <p className="text-gray-400 font-semibold text-sm">
                  Busca medicamentos disponibles y agrégalos al carrito para generar el ticket
                </p>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={24} />
                  <input
                    type="text"
                    placeholder="Buscar medicamento por nombre o categoría"
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-600 placeholder:text-gray-300"
                  />
                </div>
              </div>

              {/* Grid de Productos Scrollable */}
              <div className="flex-1 overflow-y-auto px-8 pb-8 scrollbar-hide">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-4">
                    <Loader2 className="animate-spin text-blue-500" size={40} />
                    <p className="font-semibold">Actualizando catálogo...</p>
                  </div>
                ) : products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAdd={addToCart}
                        cartQty={cartQty(product.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-4 opacity-40">
                    <Package size={80} strokeWidth={1} />
                    <p className="text-xl font-bold">No se encontraron productos</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sección de Carrito (Derecha) */}
            <div className="lg:col-span-1 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col min-h-0 overflow-hidden">
              
              {/* Header Carrito */}
              <div className="p-6 bg-[#E9F4FF] border-b border-blue-100 flex items-center justify-between h-[88px]">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2.5 rounded-xl shadow-sm text-blue-600">
                    <ShoppingCart size={26} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-2xl font-black text-blue-600 tracking-tight">Carrito</h2>
                </div>
                <div className="bg-blue-100/50 px-4 py-1.5 rounded-full border border-blue-200/50 flex items-center gap-2">
                  {reserving && <Loader2 size={11} className="animate-spin text-blue-500" />}
                  <span className="text-blue-600 font-bold text-xs uppercase tracking-tight">
                    {totalItems} Productos
                  </span>
                </div>
              </div>

              {/* Lista de Items Scrollable */}
              <div className="flex-1 overflow-y-auto px-8 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-4 opacity-40">
                    <ShoppingCart size={80} strokeWidth={1} />
                    <p className="font-bold text-lg">El carrito está vacío</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex flex-col border-b border-gray-100 py-4 last:border-0 gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                      {/* Nombre + precio total + eliminar */}
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-800 text-sm leading-tight flex-1 pr-2">{item.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-600 text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="bg-red-100/50 text-red-400 p-1 rounded-full hover:bg-red-100 transition-colors"
                            title="Eliminar del carrito"
                          >
                            <Trash2 size={13} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                      {/* Stepper de cantidad */}
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] text-gray-400 font-medium">
                          ${item.price.toFixed(2)} c/u {/*&bull; stock: {item.stock}*/}
                        </p>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => decreaseQty(item)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 w-6 h-6 rounded-md flex items-center justify-center transition-colors"
                          >
                            <Minus size={12} strokeWidth={3} />
                          </button>
                          <input
                            type="number"
                            min={1}
                            max={item.stock}
                            value={item.quantity}
                            onChange={(e) => updateQty(item, e.target.value)}
                            className="w-10 text-center text-sm font-bold text-gray-800 border border-gray-200 rounded-md py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-300"
                          />
                          <button
                            onClick={() => increaseQty(item)}
                            disabled={item.quantity >= item.stock}
                            className="bg-blue-100 hover:bg-blue-200 disabled:opacity-40 disabled:cursor-not-allowed text-blue-600 w-6 h-6 rounded-md flex items-center justify-center transition-colors"
                          >
                            <Plus size={12} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Carrito */}
              <div className="p-6 mt-auto border-t border-gray-100 bg-white flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-500 text-base tracking-tight">Total</span>
                  <span className="text-xl font-bold text-blue-600 tracking-tighter">${total.toFixed(2)}</span>
                </div>

                {/* Contador de reserva activa */}
                {countdown && (
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
                    <Clock size={14} className="text-amber-500 shrink-0" />
                    <p className="text-xs font-semibold text-amber-700">
                      Reserva activa — expira en{" "}
                      <span className="font-black tabular-nums">{countdown}</span>
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleConfirmSale}
                    disabled={cart.length === 0 || confirming}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transform transition-all active:scale-95 shadow-lg shadow-blue-100 text-sm"
                  >
                    {confirming ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Plus size={18} strokeWidth={3} />
                    )}
                    {confirming ? "Procesando..." : "Confirmar venta"}
                  </button>
                  <button
                    onClick={handlePrintTicket}
                    disabled={!lastSale}
                    className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-[#B8D4B0] disabled:cursor-not-allowed text-white py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 text-sm"
                  >
                    <Receipt size={18} strokeWidth={2.5} />
                    Generar ticket
                  </button>
                </div>

                <div className="bg-blue-50/40 p-4 rounded-xl border border-blue-100/50">
                  <p className="text-[10px] text-gray-400 font-medium text-center leading-relaxed">
                    La venta incluye {totalItems} productos en total. El sistema registrará la salida del inventario al confirmar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default NewSale;