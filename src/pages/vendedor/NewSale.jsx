import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import ProductCard from "../../components/ProductCard";
import { Search, FileText, ShoppingCart, X, Receipt, Plus, Loader2, Package } from "lucide-react";
import { getProductsRequest } from "../../api/product/product_routes";

function NewSale() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (searchTerm = "") => {
    setLoading(true);
    try {
      const response = await getProductsRequest(searchTerm);
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

  const addToCart = (product) => {
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
                      <ProductCard key={product.id} product={product} onAdd={addToCart} />
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
                <div className="bg-blue-100/50 px-4 py-1.5 rounded-full border border-blue-200/50">
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
                    <div key={item.id} className="flex justify-between items-center group border-b border-gray-100 py-4 last:border-0 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="flex flex-col gap-0.5">
                        <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                        <p className="text-[11px] text-gray-400 font-bold">
                          {item.quantity} x ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-gray-800 text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="bg-red-100/50 text-red-500 p-1.5 rounded-full hover:bg-red-100 transition-colors shadow-sm"
                        >
                          <X size={14} strokeWidth={3} />
                        </button>
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

                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transform transition-all active:scale-95 shadow-lg shadow-blue-100 text-sm">
                    <Plus size={18} strokeWidth={3} />
                    Confirmar venta
                  </button>
                  <button className="bg-[#B8D4B0] text-white py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 cursor-not-allowed opacity-80 text-sm">
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