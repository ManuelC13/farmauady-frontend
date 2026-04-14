function ModalConfirmation({
    isOpen,
    title = "",
    message = "",
    confirmText = "",
    cancelText = "",
    onConfirm,
    onCancel,
}) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onCancel}
        >
            <div
                className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between bg-blue-600 px-6 py-4">
                    <h2 className="text-lg font-bold text-white">{title}</h2>
                    <button
                        id="modal-close-btn"
                        onClick={onCancel}
                        aria-label="Cerrar"
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white/60 text-sm text-white transition hover:bg-white/20"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex flex-col items-center gap-4 px-6 py-8 text-center">
                    <p className="text-[15px] leading-relaxed text-gray-600">
                        {message}
                    </p>
                </div>

                <div className="flex gap-4 px-6 pb-6">
                    <button
                        id="modal-cancel-btn"
                        onClick={onCancel}
                        className="flex-1 cursor-pointer rounded-lg bg-red-600 py-3 text-[15px] font-bold text-white transition hover:bg-red-700"
                    >
                        {cancelText}
                    </button>
                    <button
                        id="modal-confirm-btn"
                        onClick={onConfirm}
                        className="flex-1 cursor-pointer rounded-lg bg-blue-600 py-3 text-[15px] font-bold text-white transition hover:bg-blue-700"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalConfirmation;