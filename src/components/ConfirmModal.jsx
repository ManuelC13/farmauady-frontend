import { CircleX, TriangleAlert } from "lucide-react";

function ConfirmModal({ isOpen, onClose, onConfirm, itemId, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-background rounded-xl w-full max-w-md overflow-hidden shadow-xl">

        {/* Header */}
        <div className="bg-danger px-6 py-4 flex items-center justify-between">
          <h2 className="text-white text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-white flex items-center justify-center hover:bg-white/30 transition cursor-pointer"
          >
            <CircleX size={28} />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-6 flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-full bg-danger/20 flex items-center justify-center">
            <TriangleAlert size={30} className="text-danger" />
          </div>

          <p className="text-gray-700 text-sm">{message}</p>

          {/* Botones */}
          <div className="grid grid-cols-2 gap-4 w-full mt-2">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold text-base hover:bg-gray-300 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onConfirm(itemId);
                onClose();
              }}
              className="w-full py-3 rounded-lg bg-danger text-white font-semibold text-base hover:bg-red-700 transition cursor-pointer"
            >
              Eliminar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ConfirmModal;