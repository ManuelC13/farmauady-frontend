import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login"
import ForgotPassword from "./pages/auth/ForgoutPassword"
import ResetPassword from "./pages/auth/ResetPassword"

function App() {
  return (
    <Routes>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Ruta principal de la aplicación */}
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
