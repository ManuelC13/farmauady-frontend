import { Search, Loader2, Package, FileText } from "lucide-react";
import ProductCard from "../product/ProductCard";

function NewSaleProductsPanel({
  products,
  loading,
  search,
  onSearchChange,
  onAddToCart,
  cartQty,
}) {
  return (
    <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col h-full min-h-0 overflow-hidden">
      
      <div className="px-6 py-5 bg-[#E9F4FF] border-b border-blue-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-xl shadow-sm text-blue-600">
            <FileText size={22} strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-black text-blue-600 tracking-tight">
            Nueva Venta
          </h1>
        </div>
        <div className="bg-blue-100/50 px-3 py-1.5 rounded-full border border-blue-200/50">
          <span className="text-blue-600 font-bold text-xs uppercase tracking-tight">
            {products.length} Disponibles
          </span>
        </div>
      </div>

      <div className="px-6 pt-5 pb-3 shrink-0 flex flex-col gap-3">
        <p className="text-gray-500 font-medium text-sm">
          Busca medicamentos y agrégalos al carrito para generar el ticket.
        </p>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Buscar medicamento por nombre o categoría..."
            value={search}
            onChange={onSearchChange}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-700 placeholder:text-gray-400 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-gray-400 gap-3">
            <Loader2 className="animate-spin text-blue-500" size={32} />
            <p className="font-semibold text-sm">Actualizando catálogo...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={onAddToCart}
                cartQty={cartQty(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-gray-400 gap-3 opacity-50">
            <Package size={64} strokeWidth={1} />
            <p className="text-lg font-bold">No se encontraron productos</p>
          </div>
        )}
      </div>
      
    </div>
  );
}

export default NewSaleProductsPanel;