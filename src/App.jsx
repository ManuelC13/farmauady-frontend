import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login"
import ForgotPassword from "./pages/auth/ForgotPassword"
import ResetPassword from "./pages/auth/ResetPassword"
import Dashboard from "./pages/administrator/Dashboard";
import Users from "./pages/administrator/Users";
import AdminProducts from "./pages/administrator/AdminProducts";
import Categories from "./pages/administrator/Categories";
import DashboardVendedor from "./pages/vendedor/Dashboard";
import RegisterSale from "./pages/vendedor/Register-sale";
import Products from "./pages/vendedor/Products";
import ProtectedRoute from "./routes/ProtectedRoute";
import NewSale from "./pages/vendedor/NewSale";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      {/* Redirige la raíz al login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Rutas protegidas del Administrador */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
      <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>}/>

      {/* Rutas protegidas del Vendedor */}
      <Route path="/vendedor/dashboard" element={<ProtectedRoute><DashboardVendedor /></ProtectedRoute>} />
      <Route path="/vendedor/new-sale" element={<ProtectedRoute><NewSale /></ProtectedRoute>} />  
      <Route path="/vendedor/register-sale" element={<ProtectedRoute><RegisterSale /></ProtectedRoute>} />
      <Route path="/vendedor/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />

      {/* Ruta Común */}
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
