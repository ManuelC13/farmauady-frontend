import { useState } from "react";
import { useProducts } from "../../hooks/useProducts"
import { useCategories } from "../../hooks/useCategories";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import ProductTable2 from "../../components/product/ProductTable2";
import ProductModal from "../../components/product/ProductModal";
import ConfirmModal from "../../components/common/modals/ConfirmModal";
import ManualExitModal from "../../components/inventory/ManualExitModal";
import Pagination from "../../components/layout/Pagination";
import { Plus, Search, ArrowDownRight, FileDown, Filter } from "lucide-react";

function AdminProducts() {
  const { products, page, totalPages, setPage, applyFilters, exportPDF, createProduct, updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategories();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter]   = useState("");
  const [activeFilter, setActiveFilter]       = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isManualExitModalOpen, setIsManualExitModalOpen] = useState(false);

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

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (product) => {
    setDeletingProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingProduct(null);
  };

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      product.name?.toLowerCase().includes(query) ||
      product.category?.name?.toLowerCase().includes(query)
    );
  });

  const inputBase = "border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white";

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-background min-h-screen">
        <Navbar />

        <div className="p-6 px-15 pt-10">
          <h1 className="text-2xl font-bold mt-2 mb-3">
            Catálogo de inventario
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            Gestión de medicamentos, precios y existencias.
          </p>

          <div className="rounded-xl shadow border border-gray-300 my-10">
            <div className="flex items-center justify-between gap-4 bg-lightBlue p-6 rounded-t-xl">

              {/* Barra de búsqueda */}
              <div className="relative w-full max-w-md">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar productos por nombre o SKU"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={exportPDF}
                  className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 whitespace-nowrap text-sm font-medium hover:bg-gray-50 transition"
                >
                  <FileDown size={18} /> Exportar PDF
                </button>
                <button
                  onClick={() => setIsManualExitModalOpen(true)}
                  className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 whitespace-nowrap text-sm font-medium hover:bg-gray-50 transition"
                >
                  <ArrowDownRight size={18} /> Salida manual
                </button>
                <button
                  onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
                  className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 whitespace-nowrap text-sm font-medium"
                >
                  <Plus size={18} /> Registrar medicamento
                </button>
              </div>
            </div>

            {/* Filtros */}
            <div className="flex items-end gap-4 px-6 py-4 bg-white border-b border-gray-200">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Categoría</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className={`${inputBase} min-w-[160px]`}
                >
                  <option value="">Todas</option>
                  {categories.map((c) => (
                    <option key={c.id_category} value={c.id_category}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Estado</label>
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
                className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-secondary transition cursor-pointer"
              >
                <Filter size={16} className="inline mr-1" /> Filtrar
              </button>

              <button
                onClick={handleClearFilters}
                className="px-4 py-2 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition cursor-pointer"
              >
                Limpiar
              </button>
            </div>

            <ProductModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onCreate={createProduct}
              onUpdate={updateProduct}
              editingProduct={editingProduct}
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
              products={products}
            />

            <ProductTable2
              products={filteredProducts}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;