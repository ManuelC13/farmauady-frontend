import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import LoginImg from "../../assets/login_image.webp";

const Login = () => {
    const { signin, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated]);

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
        <section id="Login" className="flex flex-col md:flex-row min-h-screen w-full bg-white md:bg-gray-100">
            {/* Contenedor izquierdo de la pantalla*/}
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-16 bg-white min-h-screen md:min-h-0">
                <div className="w-full max-w-md">

                    <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-10 md:mb-14 flex items-center gap-2 tracking-tight">
                        <span className="text-primary">+</span> FarmaUady
                    </h1>

                    <div className="mb-10 text-left">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            Bienvenido
                        </h2>
                        <p className="text-gray-500 text-lg">
                            A continuación ingrese sus credenciales para acceder al sistema
                        </p>
                    </div>

                    {/* Formulario de inicio de sesión*/}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-medium border border-red-200">
                                {error}
                            </div>
                        )}
                        {/* Campo de correo*/}
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-gray-700 ml-1">Correo electrónico</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full px-5 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="Ej. usuario@correo.com"
                                required
                            />
                        </div>

                        {/* Campo de contraseña*/}
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-gray-700 ml-1">Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full px-5 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {/* Enlace de recuperación de contraseña*/}
                        <div className="flex justify-end">
                            <p className="text-primary text-sm font-semibold cursor-pointer hover:text-blue-700 transition">
                                ¿Olvidaste tu contraseña?
                            </p>
                        </div>

                        {/* Botón de inicio de sesión*/}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-primary text-white py-4 rounded-2xl font-bold text-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-blue-100 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                        </button>
                    </form>
                </div>
            </div>

            {/* Contenedor derecho de la pantalla*/}
            <div
                style={{
                    backgroundImage: `url(${LoginImg})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                }}
                className="hidden md:block w-1/2 h-full min-h-screen bg-no-repeat"
            >
                <div className="w-full h-full bg-linear-to-t from-black/20 to-transparent"></div>
            </div>
        </section>
    );
}

export default Login;