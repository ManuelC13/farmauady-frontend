import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import ProductTable from "../../components/product/ProductTable";
import Pagination from "../../components/layout/Pagination";
import { ListFilter, Search, ChevronDown, Loader2 } from "lucide-react";
import { getProductsRequest, getCategoriesRequest } from "../../api/product/product_routes";
import { useToast } from "../../context/ToastContext";

const LIMIT = 10;

function Products() {
  const toast = useToast();
  // Estados para la categoria
  const [catOpen, setCatOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState("Todas");
  const [categories, setCategories] = useState(["Todas"]);

  // Fetch productos y categorias
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [statusOpen, setStatusOpen] = useState(false);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const catRes = await getCategoriesRequest();
        const cats = Array.isArray(catRes.data) ? catRes.data : (catRes.data?.data || []);
        setCategories(["Todas", ...cats.map(c => c.name)]);
      } catch (err) {
        console.error("Error cats:", err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const prodRes = await getProductsRequest(page, LIMIT, {
          search: searchTerm,
          category: selectedCat === "Todas" ? undefined : selectedCat,
          status: selectedStatus === "Todos" ? undefined : selectedStatus
        });
        
        // Mapeo de productos
        const responseData = prodRes.data;
        const pData = Array.isArray(responseData) ? responseData : (responseData?.data || []);
        const total = responseData?.total || pData.length;
        
        setTotalPages(Math.ceil(total / LIMIT));

        const mappedP = pData.map(p => {
          let statusStr = "Disponible";
          if (p.stock === 0) statusStr = "Agotado";
          else if (p.stock <= p.minimum_stock) statusStr = "Stock crítico";
          
          return {
            rawId: p.id_product,
            sku: p.sku || "N/A",
            name: p.name,
            category: p.category?.name || "Sin Categoría",
            price: parseFloat(p.sale_price).toFixed(2),
            stock: `${p.stock} unds.`,
            status: statusStr,
            expiry: new Date(p.expiration_date).toLocaleDateString("es-MX", { day: '2-digit', month: '2-digit', year: 'numeric' })
          };
        });
        setProducts(mappedP);

      } catch (error) {
        toast.error("Error cargando productos");
        console.error("Error cargando productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, searchTerm, selectedCat, selectedStatus]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCat, selectedStatus]);

  const statusOptions = ["Todos", "Disponible", "Stock crítico", "Agotado"];


  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <div className="flex-none">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />

        <main className="flex-1 flex flex-col p-8 min-h-0">
          <div className="flex-none">
            <h1 className="mt-4 mb-2 text-3xl font-bold text-gray-800 text-left">
              Catálogo de Productos
            </h1>
          </div>

          <div className="flex-1 flex flex-col h-full min-h-0">
            <div className="flex-none flex justify-end gap-3 mb-6 mt-4">
              
              {/* Dropdown de la categoria */}
              <div className="relative inline-block">
                <button
                  onClick={() => {
                    setCatOpen(!catOpen);
                    setStatusOpen(false); // Cerrar el otro si está abierto
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-400 rounded-lg text-gray-600 hover:bg-gray-50 transition shadow-sm h-11"
                >
                  <ListFilter size={20} className="text-gray-400" />
                  <span className="text-sm font-medium">Categoría: <span className="text-gray-400">{selectedCat}</span></span>
                  <ChevronDown size={18} className={`text-gray-400 ml-1 transition-transform ${catOpen ? "rotate-180" : ""}`} />
                </button>

                {catOpen && (
                  <div className="absolute right-0 mt-2 min-w-[200px] max-h-64 overflow-y-auto bg-white border rounded-lg shadow-lg z-50">
                    {categories.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSelectedCat(option);
                          setCatOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dropdown del estado */}
              <div className="relative inline-block">
                <button
                  onClick={() => {
                    setStatusOpen(!statusOpen);
                    setCatOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-400 rounded-lg text-gray-600 hover:bg-gray-50 transition shadow-sm h-11"
                >
                  <ListFilter size={20} className="text-gray-400" />
                  <span className="text-sm font-medium">Estado: <span className="text-gray-400">{selectedStatus}</span></span>
                  <ChevronDown size={18} className={`text-gray-400 ml-1 transition-transform ${statusOpen ? "rotate-180" : ""}`} />
                </button>

                {statusOpen && (
                  <div className="absolute right-0 mt-2 min-w-[200px] bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
                    {statusOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSelectedStatus(option);
                          setStatusOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Buscador */}
              <div className="relative flex items-center h-11">
                <Search className="absolute left-3 text-blue-500" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por SKU o nombre de producto"
                  className="pl-11 pr-4 py-2 bg-white border border-blue-400 rounded-lg text-sm w-80 focus:outline-none focus:ring-2 focus:ring-blue-200 transition shadow-sm h-full"
                />
              </div>
            </div>

            {/* Tabla */}
            <div className="flex-1 min-h-0 relative flex flex-col">
              <div className="flex-1 overflow-hidden relative">
                {loading && (
                  <div className="absolute inset-0 z-20 bg-white/50 backdrop-blur-sm flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin text-blue-500 mb-2" size={32} />
                    <span className="text-gray-500 font-medium">Cargando catálogo...</span>
                  </div>
                )}
                <ProductTable 
                  products={products}
                  searchTerm="" 
                  categoryFilter="Todas" 
                  statusFilter="Todos" 
                />
              </div>
              <Pagination 
                page={page} 
                totalPages={totalPages} 
                onPageChange={setPage} 
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


export default Products;