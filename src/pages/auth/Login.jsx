import { useState } from "react";

const Login = () => {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
    };

    return (
        <section className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
                <h1 className="text-2xl font-bold">FarmaUady</h1>
                <p>Inicia sesión</p>

                <input
                    type="text"
                    name="email"
                    placeholder="Correo electrónico"
                    value={form.email}
                    onChange={handleChange}
                    className="border p-2"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={handleChange}
                    className="border p-2"
                />

                <button
                    type="submit"
                    className="border p-2"
                >
                    Iniciar sesión
                </button>
            </form>
        </section>
    );
};

export default Login;