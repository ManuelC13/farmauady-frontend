import { Plus } from "lucide-react";

function ProductCard({ product, onAdd }) {
  const getStockColor = (stock) => {
    if (stock === 0) return "bg-red-100 text-red-600 border-red-200";
    if (stock <= 10) return "bg-yellow-100 text-yellow-600 border-yellow-200";
    return "bg-green-100 text-green-600 border-green-200";
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800 leading-tight mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-400 font-medium capitalize">
            {product.category}
          </p>
        </div>
        <button
          onClick={() => onAdd(product)}
          className="bg-[#007BFF] hover:bg-blue-600 text-white p-2.5 rounded-full shadow-lg shadow-blue-100 transition-all transform active:scale-95"
        >
          <Plus size={24} strokeWidth={3} />
        </button>
      </div>

      <div>
        <div className="text-2xl font-bold text-[#007BFF] mb-3">
          ${product.price ? product.price.toFixed(2) : "0.00"}
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStockColor(product.stock)}`}>
          Stock: {product.stock}
        </span>
      </div>
    </div>
  );
}

export default ProductCard;
