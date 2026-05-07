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
    <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col min-h-0 overflow-hidden">
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
            onChange={onSearchChange}
            className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-600 placeholder:text-gray-300"
          />
        </div>
      </div>

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
                onAdd={onAddToCart}
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
  );
}

export default NewSaleProductsPanel;
