import { useState, useEffect } from "react";
import { useCategories } from "../../hooks/useCategories";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import CategoryTable from "../../components/product/CategoryTable";
import CategoryModal from "../../components/product/CategoryModal";
import ConfirmModal from "../../components/common/modals/ConfirmModal";
import Pagination from "../../components/layout/Pagination";
import { Plus, Search } from "lucide-react";

function Categories() {
  const { categories, page, totalPages, setPage, applySearch, createCategory, updateCategory, deleteCategory } = useCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => applySearch(searchQuery), 400);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (category) => {
    setDeletingCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingCategory(null);
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-background min-h-screen">
        <Navbar />

        <div className="p-6 px-10 pt-7">
          <h1 className="text-3xl font-bold mt-2 mb-2">
            Categorías de producto
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            Categorías para la clasificación de los productos.
          </p>

          <div className="rounded-xl shadow border border-gray-300 my-5">
            <div className="flex items-center justify-between gap-4 bg-lightBlue p-6 rounded-t-xl">

              {/* Barra de búsqueda */}
              <div className="relative w-full max-w-md">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar categoría"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Botón nueva categoría */}
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setIsModalOpen(true);
                }}
                className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 whitespace-nowrap text-sm font-medium"
              >
                <Plus size={18} /> Nueva categoría
              </button>
            </div>

            <CategoryModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onCreate={async (payload) => {
                setSubmitting(true);
                try { await createCategory(payload); } finally { setSubmitting(false); }
              }}
              onUpdate={async (id, payload) => {
                setSubmitting(true);
                try { await updateCategory(id, payload); } finally { setSubmitting(false); }
              }}
              editingCategory={editingCategory}
              submitting={submitting}
            />

            <ConfirmModal
              isOpen={isDeleteModalOpen}
              onClose={handleCloseDeleteModal}
              onConfirm={deleteCategory}
              itemId={deletingCategory?.id_category}
              title="Desactivar categoría"
              message={`¿Estás seguro de que deseas desactivar la categoría "${deletingCategory?.name}"? Los productos asociados no se verán afectados.`}
            />

            <CategoryTable
              categories={categories}
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

export default Categories;