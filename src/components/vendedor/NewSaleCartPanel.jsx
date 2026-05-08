import { ShoppingCart, Loader2, Trash2, Minus, Plus, Receipt, Clock, Banknote, CreditCard } from "lucide-react";

function NewSaleCartPanel({
  cart,
  total,
  totalItems,
  countdown,
  reserving,
  confirming,
  lastSale,
  paymentMethod,
  onPaymentMethodChange,
  onIncreaseQty,
  onDecreaseQty,
  onUpdateQty,
  onRemoveFromCart,
  onConfirmSale,
  onPrintTicket,
}) {
  return (
    <div className="lg:col-span-1 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col h-full min-h-0 overflow-hidden">

      {/* Header */}
      <div className="px-6 py-5 bg-[#E9F4FF] border-b border-blue-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-xl shadow-sm text-blue-600">
            <ShoppingCart size={22} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-black text-blue-600 tracking-tight">Carrito</h2>
        </div>
        <div className="bg-blue-100/50 px-3 py-1.5 rounded-full border border-blue-200/50 flex items-center gap-2">
          {reserving && <Loader2 size={11} className="animate-spin text-blue-500" />}
          <span className="text-blue-600 font-bold text-xs uppercase tracking-tight">
            {totalItems} Productos
          </span>
        </div>
      </div>

      {/* Lista de Productos - Flex-1 para ocupar el máximo espacio */}
      <div className="flex-1 overflow-y-auto px-6 py-2 custom-scrollbar">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-3 opacity-40">
            <ShoppingCart size={64} strokeWidth={1} />
            <p className="font-bold text-base">El carrito está vacío</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="flex flex-col border-b border-gray-100 py-3.5 last:border-0 gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-start gap-3">
                <h4 className="font-bold text-gray-800 text-sm leading-tight flex-1">{item.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="font-black text-blue-600 text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => onRemoveFromCart(item.id)}
                    className="bg-red-50 text-red-400 p-1.5 rounded-lg hover:bg-red-100 transition-colors"
                    title="Eliminar del carrito"
                  >
                    <Trash2 size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400 font-medium">
                  ${item.price.toFixed(2)} c/u
                </p>
                <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
                  <button
                    onClick={() => onDecreaseQty(item)}
                    className="bg-white hover:bg-gray-100 text-gray-600 w-6 h-6 rounded-md flex items-center justify-center transition-colors shadow-sm border border-gray-200"
                  >
                    <Minus size={13} strokeWidth={2.5} />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={item.stock}
                    value={item.quantity}
                    onChange={(e) => onUpdateQty(item, e.target.value)}
                    className="w-10 text-center text-sm font-bold text-gray-800 bg-transparent focus:outline-none"
                  />
                  <button
                    onClick={() => onIncreaseQty(item)}
                    disabled={item.quantity >= item.stock}
                    className="bg-blue-50 hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed text-blue-600 w-6 h-6 rounded-md flex items-center justify-center transition-colors shadow-sm border border-blue-100"
                  >
                    <Plus size={13} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sección Inferior - Espacios reducidos y empaquetados (shrink-0) */}
      <div className="px-6 py-5 border-t border-gray-100 bg-white flex flex-col gap-4 shrink-0">

        {countdown && (
          <div className="flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <Clock size={14} className="text-amber-500 shrink-0" />
            <p className="text-xs font-semibold text-amber-700">
              Reserva activa — expira en{" "}
              <span className="font-black tabular-nums">{countdown}</span>
            </p>
          </div>
        )}

        <div className="flex justify-between items-end">
          <span className="font-semibold text-gray-400 text-sm uppercase tracking-wider">Total</span>
          <span className="text-2xl font-black text-blue-600 tracking-tighter leading-none">${total.toFixed(2)}</span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Forma de pago
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onPaymentMethodChange("efectivo")}
              className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-bold transition-all ${
                paymentMethod === "efectivo"
                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Banknote size={16} />
              Efectivo
            </button>
            <button
              type="button"
              onClick={() => onPaymentMethodChange("tarjeta")}
              className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-bold transition-all ${
                paymentMethod === "tarjeta"
                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <CreditCard size={16} />
              Tarjeta
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onConfirmSale}
            disabled={cart.length === 0 || confirming}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transform transition-all active:scale-95 shadow-md shadow-blue-100 text-sm"
          >
            {confirming ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Plus size={16} strokeWidth={3} />
            )}
            {confirming ? "Procesando" : "Confirmar"}
          </button>
          <button
            onClick={onPrintTicket}
            disabled={!lastSale}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-[#B8D4B0] disabled:cursor-not-allowed text-white py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 text-sm"
          >
            <Receipt size={16} strokeWidth={2.5} />
            Ticket
          </button>
        </div>

        <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
          <p className="text-[10px] text-gray-500 font-medium text-center leading-relaxed">
            Incluye {totalItems} productos. El inventario se actualizará al confirmar.
          </p>
        </div>
        
      </div>
    </div>
  );
}

export default NewSaleCartPanel;