import { useState } from "react";
import { Cross } from "lucide-react";
import PrimaryButton from "../../components/PrimaryButton";
import { forgotPasswordRequest } from "../../api/auth/auth_routes";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await forgotPasswordRequest(email);
            setSent(true);
        } catch (err) {
            setError(err.response?.data?.detail || "No se pudo enviar el correo. Intenta de nuevo.");
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

                {sent ? (
                    <div className="text-center py-4">
                        <p className="font-bold text-gray-900 text-lg mb-2">¡Correo enviado!</p>
                        <p className="text-gray-500 text-sm">
                            Si la cuenta existe, recibirás un correo con el token de recuperación.
                            Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
                        </p>
                    </div>
                ) : (
                    <>
                        <h2 className="font-bold text-gray-900 text-xl mb-2">
                            Reestablecer contraseña
                        </h2>
                        <p className="text-gray-500 text-sm mb-6">
                            Introduce la dirección de correo electrónico asociada a tu cuenta de usuario y te enviaremos un enlace para restablecer la contraseña.
                        </p>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-medium border border-red-200">
                                    {error}
                                </div>
                            )}

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700 ml-1">
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    required
                                />
                            </div>

                            <PrimaryButton loading={loading} loadingText="Enviando..." textSize="text-sm">
                                Enviar correo de restablecimiento
                            </PrimaryButton>
                        </form>
                    </>
                )}
            </div>
        </section>
    );
};

export default ForgotPassword;
