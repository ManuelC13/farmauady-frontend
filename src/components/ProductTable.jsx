function ProductTable({ products = [] }) {
  // Mock de datos para el catálogo
  const displayProducts = products.length > 0 ? products : [
    { sku: "000001", name: "Paracetamol", category: "Analgésicos", price: "45.00", stock: "120 unds.", status: "Disponible", expiry: "12/04/2026" },
    { sku: "000002", name: "Ibuprofeno", category: "Analgésicos", price: "55.00", stock: "8 unds.", status: "Stock crítico", expiry: "12/04/2026" },
    { sku: "000003", name: "Amoxicilina", category: "Antibióticos", price: "120.00", stock: "45 unds.", status: "Disponible", expiry: "12/04/2026" },
    { sku: "000004", name: "Omeprazol", category: "Gastrointestinal", price: "65.00", stock: "0 unds.", status: "Agotado", expiry: "12/04/2026" },
  ];

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

          <tbody className="divide-y divide-gray-100 italic">
            {displayProducts.map((product, index) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductTable;
