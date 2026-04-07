import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login"
import ForgotPassword from "./pages/auth/ForgotPassword"
import ResetPassword from "./pages/auth/ResetPassword"
import Dashboard from "./pages/administrator/Dashboard";
import Users from "./pages/administrator/Users";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Administrador */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/users" element={<Users />} />

      {/* Ruta principal de la aplicación */}
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
