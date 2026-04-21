import { Plus } from "lucide-react";

function ProductCard({ product, onAdd }) {
  const getStockColor = (stock) => {
    if (stock === 0) return "bg-red-100 text-red-700 border-red-200";
    if (stock <= 10) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-green-100 text-green-700 border-green-200";
  };

  const getStockLabel = (stock) => {
      if (stock === 0) return "Agotado";
      if (stock <= 10) return `Stock crítico: ${stock}`;
      return `Stock: ${stock}`;
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-sm font-bold text-gray-800 leading-tight">
          {product.name}
        </h3>
        <p className="text-[11px] text-gray-400 font-medium mb-1">
          {product.category}
        </p>
        <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-[#007BFF]">
                ${product.price ? product.price.toFixed(2) : "0.00"}
            </span>
            <div className="flex">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${getStockColor(product.stock)}`}>
                    {getStockLabel(product.stock)}
                </span>
            </div>
        </div>
      </div>
      
      <button
        onClick={() => onAdd(product)}
        className="bg-[#007BFF] hover:bg-blue-600 text-white p-2 rounded-full shadow-lg shadow-blue-100 transition-all transform active:scale-95 group-hover:scale-105"
      >
        <Plus size={20} strokeWidth={3} />
      </button>
    </div>
  );
}

export default ProductCard;
