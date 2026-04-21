import { useState } from "react";
import { useProducts } from "../../hooks/useProducts"
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import ProductTable2 from "../../components/ProductTable2";
import ProductModal from "../../components/ProductModal";
import ConfirmModal from "../../components/ConfirmModal";
import ManualExitModal from "../../components/ManualExitModal";
import { Plus, Search, ArrowDownRight } from "lucide-react";

function AdminProducts() {
  const { products, createProduct, updateProduct, deleteProduct } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isManualExitModalOpen, setIsManualExitModalOpen] = useState(false);

  const filteredProducts = products.filter((product) => {
    const name = product.name?.toLowerCase();
    const sku = product.sku?.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    return name.includes(query) || sku.includes(query);
  });

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
                {/* Botón salida manual */}
                <button
                  onClick={() => setIsManualExitModalOpen(true)}
                  className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 whitespace-nowrap text-sm font-medium hover:bg-gray-50 transition"
                >
                  <ArrowDownRight size={18} /> Salida manual
                </button>

                {/* Botón registrar medicamento */}
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsModalOpen(true);
                  }}
                  className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 whitespace-nowrap text-sm font-medium"
                >
                  <Plus size={18} /> Nuevo producto
                </button>
              </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;