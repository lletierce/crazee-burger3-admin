import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import LoginPage from "../../pages/auth/login/LoginPage";
import NotFoundPage from "../../pages/error/NotFoundPage";
import DebugPage from "../../pages/error/DebugPage";
import { useAuth } from "../providers/AuthProvider";
import ProtectedRoute from "./ProtectedRoute";
import ProductsPage from "../../pages/products/ProductsPage";

export default function AppRouter() {

  const { user } = useAuth()


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={user ? "/produits" : "/login"} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/debug" element={<DebugPage />} />


        {/* Routes privées */}
        <Route element={<ProtectedRoute />}>
          <Route path="/produits" element={<ProductsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}