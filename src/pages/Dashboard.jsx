import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center gap-6 w-full max-w-md">
                <h1 className="text-3xl font-extrabold text-primary">
                    <span className="text-primary">+</span> FarmaUady
                </h1>
                <p className="text-gray-600 text-lg">
                    Bienvenido{user?.name ? `, ${user.name}` : ""}
                </p>
                <p className="text-sm text-gray-400">Dashboard en construcción</p>
                <button
                    onClick={handleLogout}
                    className="w-full bg-primary text-white py-3 rounded-2xl font-bold hover:brightness-110 transition-all"
                >
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
