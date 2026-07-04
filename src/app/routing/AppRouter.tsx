import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import LoginPage from "../../pages/auth/LoginPage";
import NotFoundPage from "../../pages/error/NotFoundPage";
import DebugPage from "../../pages/error/DebugPage";
import { useAuth } from "../providers/AuthProvider";
import ProtectedRoute from "./ProtectedRoute";
import ProductsPage from "../../pages/products/ProductsPage";
import ResetPasswordPage from "../../pages/auth/ResetPasswordPage";
import RecoveryPage from "../../pages/auth/RecoveryPage";

export default function AppRouter() {

  const { user } = useAuth()


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={user ? "/produits" : "/login"} />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/recovery" element={<RecoveryPage />} />
        
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/debug" element={<DebugPage />} />

        <Route path="/produits" element={<ProductsPage />} />


        {/* Routes privées */}
        {/* <Route element={<ProtectedRoute />}>
          <Route path="/produits" element={<ProductsPage />} />
        </Route> */}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}