import { useState, useRef, useEffect } from "react";
import { useProducts } from "../../hooks/useProducts";
import { getAllActiveCategoriesRequest } from "../../api/product/category_routes";
import { useToast } from "../../context/ToastContext";
import { getMovementsReportRequest } from "../../api/product/inventory_routes";
import { ManualMovementsReportPDF } from "../../components/pdf/ManualMovementsReportPDF";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import ProductTable2 from "../../components/product/ProductTable2";
import ProductModal from "../../components/product/ProductModal";
import ConfirmModal from "../../components/common/modals/ConfirmModal";
import ManualExitModal from "../../components/inventory/ManualExitModal";
import Pagination from "../../components/layout/Pagination";
import { Plus, Search, ArrowDownRight, FileDown, ChevronDown, Filter } from "lucide-react";

function AdminProducts() {
  const { products, page, totalPages, setPage, applyFilters, applySearch, exportPDF, createProduct, updateProduct, deleteProduct } = useProducts();

  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery]         = useState("");
  const [categoryFilter, setCategoryFilter]   = useState("");
  const [activeFilter, setActiveFilter]       = useState("");
  const [isModalOpen, setIsModalOpen]         = useState(false);
  const [editingProduct, setEditingProduct]   = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isManualExitModalOpen, setIsManualExitModalOpen] = useState(false);
  const [submitting, setSubmitting]           = useState(false);

  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const exportMenuRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
        setExportMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => applySearch(searchQuery), 400);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getAllActiveCategoriesRequest();
        setCategories(data);
      } catch {}
    };
    load();
  }, []);

  const handleExportMovements = async () => {
    setExportMenuOpen(false);
    try {
      const { data } = await getMovementsReportRequest();

      if (!data || data.length === 0) {
        toast.warning("No hay movimientos de salida registrados para generar el reporte.");
        return;
      }

      const blob = await ManualMovementsReportPDF(data);
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `salidas_${new Date().toISOString().split('T')[0]}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
      toast.error("Error al generar el reporte de salidas");
    }
  };

  const handleFilter = () => {
    const newFilters = {};
    if (categoryFilter) newFilters.category_id = categoryFilter;
    if (activeFilter !== "") newFilters.active = activeFilter === "true";
    applyFilters(newFilters);
  };

  const handleClearFilters = () => {
    setCategoryFilter("");
    setActiveFilter("");
    applyFilters({});
  };

  const handleEditClick   = (product) => { setEditingProduct(product); setIsModalOpen(true); };
  const handleDeleteClick = (product) => { setDeletingProduct(product); setIsDeleteModalOpen(true); };
  const handleCloseModal  = () => { setIsModalOpen(false); setEditingProduct(null); };
  const handleCloseDeleteModal = () => { setIsDeleteModalOpen(false); setDeletingProduct(null); };

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      product.name?.toLowerCase().includes(query) ||
      product.category?.name?.toLowerCase().includes(query)
    );
  });

  const inputBase = "border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-background h-10";

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-background min-h-screen">
        <Navbar />

        <div className="p-6 px-10 pt-7">

          {/* Título + botones */}
          <div className="flex items-center justify-between mt-2 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">Catálogo de inventario</h1>
              <p className="text-sm text-gray-400">Gestión de medicamentos, precios y existencias.</p>
            </div>
            {/* Botones */}
            <div className="flex items-center gap-3">
              {/* Dropdown exportar */}
              <div className="relative" ref={exportMenuRef}>
                <button
                  onClick={() => setExportMenuOpen(!exportMenuOpen)}
                  className="border border-blue-400 bg-white text-primary px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 whitespace-nowrap text-sm font-medium hover:bg-gray-100 transition"
                >
                  <FileDown size={20} />
                  Descargar reporte
                  <ChevronDown size={16} className={`transition-transform ${exportMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {exportMenuOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                    <button
                      onClick={() => { exportPDF(); setExportMenuOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
                    >
                      Reporte de productos
                    </button>
                    <button
                      onClick={handleExportMovements}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2 border-t border-gray-100"
                    >
                      Reporte de salidas manuales
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsManualExitModalOpen(true)}
                className="border border-blue-400 bg-white text-primary px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 whitespace-nowrap text-sm font-medium hover:bg-gray-100 transition"
              >
                <ArrowDownRight size={20} /> Salida manual
              </button>
              <button
                onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
                className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 whitespace-nowrap text-sm font-medium hover:bg-secondary transition"
              >
                <Plus size={20} /> Registrar medicamento
              </button>
            </div>
          </div>

          {/* Buscador + filtros */}
          <div className="flex items-end justify-between gap-3 mt-13 mb-6">

            {/* Buscador — izquierda */}
            <div className="relative flex items-center">
              <Search size={18} className="absolute left-3 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar productos por nombre o SKU"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 bg-white border border-gray-300 rounded-lg text-sm w-80 focus:outline-none focus:ring-2 focus:ring-blue-400 h-10"
              />
            </div>

            {/* Filtros — derecha */}
            <div className="flex items-end gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Categoría</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className={`${inputBase} min-w-[160px]`}
                >
                  <option value="">Todos</option>
                  {categories.map((c) => (
                    <option key={c.id_category} value={c.id_category}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Estado</label>
                <select
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                  className={`${inputBase} min-w-[130px]`}
                >
                  <option value="">Todos</option>
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>

              <button
                onClick={handleFilter}
                className="h-10 px-4 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-secondary transition cursor-pointer flex items-center gap-2"
              >
                <Filter size={16} /> Filtrar
              </button>

              <button
                onClick={handleClearFilters}
                className="h-10 px-4 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition cursor-pointer"
              >
                Limpiar
              </button>
            </div>
          </div>

          {/* Tabla */}
          <div className="rounded-xl shadow border border-gray-300">
            <ProductTable2
              products={products}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>

          <ProductModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onCreate={async (payload) => {
              setSubmitting(true);
              try { await createProduct(payload); } finally { setSubmitting(false); }
            }}
            onUpdate={async (id, payload) => {
              setSubmitting(true);
              try { await updateProduct(id, payload); } finally { setSubmitting(false); }
            }}
            editingProduct={editingProduct}
            submitting={submitting}
          />

          <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            onConfirm={deleteProduct}
            itemId={deletingProduct?.id_product}
            title="Eliminar Producto"
            message={`¿Estás seguro de que deseas eliminar el producto ${deletingProduct?.name}? Esta acción no se puede deshacer.`}
          />

          <ManualExitModal
            isOpen={isManualExitModalOpen}
            onClose={() => setIsManualExitModalOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;