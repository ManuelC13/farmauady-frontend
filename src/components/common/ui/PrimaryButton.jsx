function PrimaryButton({ loading, loadingText = "Cargando...", children, type = "submit", textSize = "text-xl" }) {
    return (
        <button
            type={type}
            disabled={loading}
            className={`w-full bg-primary text-white py-3 rounded-2xl font-bold ${textSize} hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-blue-100 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
        >
            {loading ? loadingText : children}
        </button>
    )
}

export default PrimaryButton;