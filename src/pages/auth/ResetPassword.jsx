import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Cross, Eye, EyeOff, CheckCircle } from "lucide-react";
import PrimaryButton from "../../components/common/ui/PrimaryButton";
import { resetPasswordRequest } from "../../api/auth/auth_routes";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [form, setForm] = useState({ new_password: "", confirm_password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (form.new_password !== form.confirm_password) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (!token) {
            setError("El enlace de restablecimiento no es válido o ha expirado.");
            return;
        }

        setLoading(true);
        try {
            await resetPasswordRequest(token, form.new_password, form.confirm_password);
            setSuccess(true);
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "No se pudo restablecer la contraseña. El enlace puede haber expirado."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen w-full bg-white flex items-center justify-center p-6">
            <div className="w-full max-w-sm bg-white border-2 border-dashed border-blue-300 rounded-2xl p-8">

                <h1 className="text-4xl font-extrabold text-primary flex items-center justify-center gap-2 mb-6">
                    <Cross size={40} strokeWidth={2.5} />
                    FarmaUady
                </h1>

                {success ? (
                    <div className="text-center py-4">
                        <div className="flex justify-center mb-3">
                            <CheckCircle size={48} className="text-green-500" />
                        </div>
                        <p className="font-bold text-gray-900 text-lg mb-2">
                            ¡Contraseña actualizada!
                        </p>
                        <p className="text-gray-500 text-sm mb-6">
                            Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
                        </p>
                        <Link
                            to="/login"
                            className="inline-block w-full text-center bg-primary text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all"
                        >
                            Ir al inicio de sesión
                        </Link>
                    </div>
                ) : (
                    <>
                        <h2 className="font-bold text-gray-900 text-xl mb-2">
                            Nueva contraseña
                        </h2>
                        <p className="text-gray-500 text-sm mb-6">
                            Ingresa y confirma tu nueva contraseña para completar el restablecimiento.
                        </p>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-medium border border-red-200">
                                    {error}
                                </div>
                            )}

                            {/* Nueva contraseña */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700 ml-1">
                                    Nueva contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="new_password"
                                        value={form.new_password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 pr-11 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        placeholder="Mínimo 8 caracteres"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                    >
                                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirmar contraseña */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700 ml-1">
                                    Confirmar contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        name="confirm_password"
                                        value={form.confirm_password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 pr-11 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        placeholder="Repite la contraseña"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                    >
                                        {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                </div>
                            </div>

                            <PrimaryButton loading={loading} loadingText="Guardando..." textSize="text-sm">
                                Restablecer contraseña
                            </PrimaryButton>

                            <div className="text-center">
                                <Link
                                    to="/login"
                                    className="text-primary text-sm hover:text-blue-700 transition"
                                >
                                    ← Volver al inicio de sesión
                                </Link>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </section>
    );
};

export default ResetPassword;