import { ShoppingCart, Loader2, Trash2, Minus, Plus, Receipt, Clock } from "lucide-react";

function NewSaleCartPanel({
  cart,
  total,
  totalItems,
  countdown,
  reserving,
  confirming,
  lastSale,
  onIncreaseQty,
  onDecreaseQty,
  onUpdateQty,
  onRemoveFromCart,
  onConfirmSale,
  onPrintTicket,
}) {
  return (
    <div className="lg:col-span-1 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col min-h-0 overflow-hidden">
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

      <div className="flex-1 overflow-y-auto px-8 custom-scrollbar">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-4 opacity-40">
            <ShoppingCart size={80} strokeWidth={1} />
            <p className="font-bold text-lg">El carrito está vacío</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="flex flex-col border-b border-gray-100 py-4 last:border-0 gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-gray-800 text-sm leading-tight flex-1 pr-2">{item.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-600 text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => onRemoveFromCart(item.id)}
                    className="bg-red-100/50 text-red-400 p-1 rounded-full hover:bg-red-100 transition-colors"
                    title="Eliminar del carrito"
                  >
                    <Trash2 size={13} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-gray-400 font-medium">
                  ${item.price.toFixed(2)} c/u {/*&bull; stock: {item.stock}*/}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onDecreaseQty(item)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 w-6 h-6 rounded-md flex items-center justify-center transition-colors"
                  >
                    <Minus size={12} strokeWidth={3} />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={item.stock}
                    value={item.quantity}
                    onChange={(e) => onUpdateQty(item, e.target.value)}
                    className="w-10 text-center text-sm font-bold text-gray-800 border border-gray-200 rounded-md py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-300"
                  />
                  <button
                    onClick={() => onIncreaseQty(item)}
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

      <div className="p-6 mt-auto border-t border-gray-100 bg-white flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-500 text-base tracking-tight">Total</span>
          <span className="text-xl font-bold text-blue-600 tracking-tighter">${total.toFixed(2)}</span>
        </div>

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
            onClick={onConfirmSale}
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
            onClick={onPrintTicket}
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
  );
}

export default NewSaleCartPanel;
