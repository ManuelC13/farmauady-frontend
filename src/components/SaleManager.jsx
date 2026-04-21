import { useState, useEffect } from "react";
import { Search, Package, Loader2 } from "lucide-react";
import { getProductsRequest } from "../api/product/product_routes";
import ProductCard from "./ProductCard";

function SaleManager() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchProducts = async (searchTerm = "") => {
        setLoading(true);
        try {
            const response = await getProductsRequest(searchTerm);
            //Mapeo de datos del backend para las tarjetas
            const mappedProducts = response.data.products.map(p => ({
                id: p.id_product,
                name: p.name,
                category: p.category_name,
                price: parseFloat(p.sale_price),
                stock: p.stock
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

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        // Aqui implementaremos un debounce si hay muchos productos para no saturar el backend
        fetchProducts(value);
    };

    return (
        <div className="flex flex-col h-full space-y-6">
            {/* Barra de Búsqueda */}
            <div className="relative flex items-center w-full max-w-md">
                <Search className="absolute left-4 text-blue-500" size={20} />
                <input
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Buscar por nombre o categoría..."
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-sm"
                />
            </div>

            {/* Lista de Productos */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-4">
                        <Loader2 className="animate-spin text-blue-500" size={40} />
                        <p className="font-medium">Cargando catálogo...</p>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                onAdd={() => console.log("Añadido:", product.name)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-4 opacity-60">
                        <Package size={64} strokeWidth={1} />
                        <p className="text-xl font-semibold">No se encontraron productos</p>
                        <p className="text-sm">Intenta con otro término de búsqueda</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SaleManager;
