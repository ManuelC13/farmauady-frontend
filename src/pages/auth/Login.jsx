import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import PrimaryButton from "../../components/PrimaryButton";
import { Cross, Eye, EyeOff } from "lucide-react";

import LoginImg from "../../assets/login_image.webp";

const Login = () => {

    const { user, signin, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === "Vendedor") {
                navigate("/vendedor/dashboard");
            } else {
                navigate("/dashboard");
            }
        }
    }, [isAuthenticated, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await signin(form.email, form.password);
        } catch (err) {
            setError(err.response?.data?.detail || "Error al iniciar sesión. No se pudo conectar al servidor o revise su conexión a internet.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="Login" className="flex min-h-screen w-full">
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-12 py-10 bg-white">
                <div className="w-full max-w-sm">

                    <h1 className="text-4xl font-extrabold text-primary flex items-center gap-2 mb-8">
                        <Cross size={40} strokeWidth={2.5} />
                        FarmaUady
                    </h1>

                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Bienvenido</h2>
                        <p className="text-gray-500 text-sm">
                            A continuación ingrese sus credenciales para acceder al sistema
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-medium border border-red-200">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-700">Correo electrónico</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-700">Contraseña</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 pr-11 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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

                        <div className="flex justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-primary text-sm hover:text-blue-700 transition"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        <PrimaryButton loading={loading} loadingText="Iniciando sesión..." textSize="text-base">
                            Iniciar Sesión
                        </PrimaryButton>
                    </form>
                </div>
            </div>

            <div
                style={{
                    backgroundImage: `url(${LoginImg})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                }}
                className="hidden md:block w-1/2 min-h-screen bg-no-repeat"
            />
        </section>
    );
}

export default Login;