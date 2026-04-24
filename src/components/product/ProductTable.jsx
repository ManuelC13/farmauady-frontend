import { Loader2, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { getProductsRequest } from "../../api/product/product_routes";
import { useToast } from "../../context/ToastContext";

function ProductTable({ products: propProducts, searchTerm = "", categoryFilter = "Todas", statusFilter = "Todos" }) {
  const [products, setProducts] = useState(propProducts || []);
  const [loading, setLoading] = useState(!propProducts);
  const toast = useToast()

  useEffect(() => {
    if (propProducts && propProducts.length > 0) {
      setProducts(propProducts);
      setLoading(false);
      return;
    }
    
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await getProductsRequest();
        
        const productList = Array.isArray(data) ? data : (data?.products || []);

        const mappedProducts = productList.map(p => {
          let statusStr = "Disponible";
          if (p.stock === 0) {
            statusStr = "Agotado";
          } else if (p.stock <= p.minimum_stock) {
            statusStr = "Stock crítico";
          }
          
          return {
            sku: p.sku || "N/A",
            name: p.name,
            category: p.category?.name || "Sin Categoría",
            price: parseFloat(p.sale_price).toFixed(2),
            stock: `${p.stock} unds.`,
            status: statusStr,
            expiry: new Date(p.expiration_date).toLocaleDateString("es-MX", { day: '2-digit', month: '2-digit', year: 'numeric' })
          };
        });
        setProducts(mappedProducts);
      } catch (error) {
        toast.error("Error cargando productos");
        console.error("Error cargando productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [propProducts]);

  const displayProducts = products.filter(product => {
    // Filtrar por SKU o nombre de producto
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      const skuMatch = product.sku && product.sku.toLowerCase().includes(lowerSearch);
      const nameMatch = product.name && product.name.toLowerCase().includes(lowerSearch);
      if (!skuMatch && !nameMatch) return false;
    }

    // Filtrar por categoría
    if (categoryFilter && categoryFilter !== "Todas") {
      if (product.category !== categoryFilter) return false;
    }

    // Filtrar por estado
    if (statusFilter && statusFilter !== "Todos") {
      if (product.status !== statusFilter) return false;
    }

    return true;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case "Disponible":
        return "bg-green-100 text-green-700";
      case "Stock crítico":
        return "bg-yellow-100 text-yellow-700";
      case "Agotado":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full flex flex-col">
      {/* Tabla con scroll */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#EDF5FF] sticky top-0 z-10 shadow-sm border-b border-blue-100">
              <th className="py-4 px-6 text-[#A0C4FF] font-semibold text-xs uppercase tracking-wider text-left bg-[#EDF5FF]">Código (SKU)</th>
              <th className="py-4 px-6 text-[#A0C4FF] font-semibold text-xs uppercase tracking-wider text-left bg-[#EDF5FF]">Producto</th>
              <th className="py-4 px-6 text-[#A0C4FF] font-semibold text-xs uppercase tracking-wider text-left bg-[#EDF5FF]">Categoría</th>
              <th className="py-4 px-6 text-[#A0C4FF] font-semibold text-xs uppercase tracking-wider text-left bg-[#EDF5FF]">Precio de venta</th>
              <th className="py-4 px-6 text-[#A0C4FF] font-semibold text-xs uppercase tracking-wider text-left bg-[#EDF5FF]">Stock</th>
              <th className="py-4 px-6 text-[#A0C4FF] font-semibold text-xs uppercase tracking-wider text-center bg-[#EDF5FF]">Estado</th>
              <th className="py-4 px-6 text-[#A0C4FF] font-semibold text-xs uppercase tracking-wider text-left bg-[#EDF5FF]">Vencimiento</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Loader2 className="animate-spin text-blue-500" size={32} />
                    <span className="text-sm font-medium">Cargando catálogo...</span>
                  </div>
                </td>
              </tr>
            ) : displayProducts.length > 0 ? (
              displayProducts.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-sm font-medium text-gray-700">{product.sku}</td>
                  <td className="py-4 px-6 text-sm text-gray-800 font-bold">{product.name}</td>
                  <td className="py-4 px-6 text-sm text-gray-600 font-bold">{product.category}</td>
                  <td className="py-4 px-6 text-sm font-bold text-gray-800">${product.price}</td>
                  <td className="py-4 px-6 text-sm text-gray-600 font-bold">{product.stock}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-4 py-1 rounded-full text-xs font-bold ${getStatusStyle(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 font-bold">{product.expiry}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-12 text-center text-gray-400 italic">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Info size={32} className="text-gray-300" />
                    <span className="text-sm font-medium">No hay productos en el catálogo</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductTable;
