import { useState, useEffect, useRef } from "react";
import { Search, X, Package, Loader2, AlertTriangle, CheckCircle2, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getSaleProductsRequest } from "../../api/product/product_routes";

function ProductSearchModal({ isOpen, onClose }) {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const debounceRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setSearch("");
            setProducts([]);
            setSearched(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        if (debounceRef.current) clearTimeout(debounceRef.current);

        const term = search.trim();
        if (term === "") {
            setProducts([]);
            setSearched(false);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            setSearched(true);
            try {
                const res = await getSaleProductsRequest(term);
                const pList = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.products || []);
                const mapped = pList.map((p) => ({
                    id: p.id_product,
                    name: p.name,
                    category: p.category_name || p.category?.name || "Sin Categoría",
                    price: parseFloat(p.sale_price),
                    stock: p.stock,
                    minimumStock: p.minimum_stock,
                }));
                setProducts(mapped);
            } catch {
                setProducts([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(debounceRef.current);
    }, [search, isOpen]);

    const handleKeyDown = (e) => {
        if (e.key === "Escape") onClose();
    };

    if (!isOpen) return null;

    const getStockStatus = (stock, minimumStock) => {
        if (stock === 0) return "sin_stock";
        if (stock <= minimumStock) return "bajo";
        return "ok";
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden h-[500px] max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#E9F4FF]">
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-xl shadow-sm text-blue-600">
                            <Package size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-blue-600 tracking-tight leading-none">
                                Consultar producto
                            </h2>
                            <p className="text-xs text-blue-400 font-medium mt-0.5">
                                Busca por nombre o categoría
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-blue-400 hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Buscador */}
                <div className="px-6 py-4 border-b border-gray-100">
                    <div className="relative">
                        <Search
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                            size={20}
                        />
                        {loading && (
                            <Loader2
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 animate-spin"
                                size={18}
                            />
                        )}
                        <input
                            ref={inputRef}
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Escribe el nombre del medicamento o categoría..."
                            className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
                        />
                    </div>
                </div>

                {/* Resultados */}
                <div className="flex-1 overflow-y-auto">
                    {!searched && (
                        <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-3">
                            <Search size={48} strokeWidth={1} />
                            <p className="text-sm font-semibold">Escribe algo para buscar un producto</p>
                        </div>
                    )}

                    {searched && !loading && products.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-3">
                            <Package size={48} strokeWidth={1} />
                            <p className="text-sm font-semibold">No se encontraron productos</p>
                        </div>
                    )}

                    {searched && products.length > 0 && (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-gray-400 font-semibold text-xs uppercase tracking-wider">
                                    <th className="text-left px-6 py-3">Producto</th>
                                    <th className="text-left px-4 py-3 hidden sm:table-cell">Categoría</th>
                                    <th className="text-right px-4 py-3">Precio</th>
                                    <th className="text-right px-4 py-3">Disponible</th>
                                    <th className="text-center px-6 py-3">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {products.map((p) => {
                                    const status = getStockStatus(p.stock, p.minimumStock);
                                    return (
                                        <tr
                                            key={p.id}
                                            className="hover:bg-blue-50/40 transition-colors"
                                        >
                                            <td className="px-6 py-3.5 font-semibold text-gray-800">
                                                {p.name}
                                            </td>
                                            <td className="px-4 py-3.5 text-gray-400 hidden sm:table-cell">
                                                {p.category}
                                            </td>
                                            <td className="px-4 py-3.5 text-right text-gray-600 font-medium">
                                                ${p.price.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3.5 text-right whitespace-nowrap">
                                                {status === "ok" && (
                                                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-lg text-xs">
                                                        <CheckCircle2 size={12} />
                                                        {p.stock} uds.
                                                    </span>
                                                )}
                                                {status === "bajo" && (
                                                    <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 font-bold px-2.5 py-1 rounded-lg text-xs">
                                                        <AlertTriangle size={12} />
                                                        {p.stock} uds.
                                                    </span>
                                                )}
                                                {status === "sin_stock" && (
                                                    <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 font-bold px-2.5 py-1 rounded-lg text-xs">
                                                        <X size={12} />
                                                        Sin stock
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-3.5 text-center">
                                                <button
                                                    onClick={() => navigate(`/vendedor/new-sale?search=${encodeURIComponent(p.name)}`)}
                                                    disabled={p.stock <= 0}
                                                    title="Ir a vender"
                                                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-200 disabled:text-gray-400 cursor-pointer"
                                                >
                                                    <ShoppingCart size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer*/}
                {searched && products.length > 0 && (
                    <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center gap-5 text-xs text-gray-400 font-medium">
                        <span className="flex items-center gap-1.5 text-emerald-600">
                            <CheckCircle2 size={12} /> Disponible
                        </span>
                        <span className="flex items-center gap-1.5 text-amber-600">
                            <AlertTriangle size={12} /> Stock bajo
                        </span>
                        <span className="flex items-center gap-1.5 text-red-500">
                            <X size={12} /> Sin stock
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductSearchModal;
