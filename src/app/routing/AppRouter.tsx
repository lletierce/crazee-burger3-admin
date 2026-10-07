import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import LoginPage from "../../pages/auth/LoginPage";
import NotFoundPage from "../../pages/error/NotFoundPage";
import ProductsPage from "../../pages/products/ProductsPage";
import RecoveryPage from "../../pages/auth/RecoveryPage";
import { ProductPage } from "../../pages/products/ProductPage";
import GuestRoute from "./GuestRoute";
import ProtectedRoute from "./ProtectedRoute";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";

export default function AppRouter() {

  return (
    <BrowserRouter>
      <Routes>
        {/* "/" redirige toujours vers /produits : c'est ProtectedRoute qui décidera */}
        <Route path="/" element={<Navigate to="/produits" replace />} />

        {/* Routes réservées aux visiteurs non connectés */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Routes publiques (accessibles depuis le lien du mail) */}
        <Route path="/recovery" element={<RecoveryPage />} />

        {/* Routes privées */}
        <Route element={<ProtectedRoute />}>
          {/* Pages avec navbar */}
          <Route element={<AuthenticatedLayout />}>
            <Route path="/produits" element={<ProductsPage />} />
            <Route path="/produits/:slug" element={<ProductPage />} />
          </Route>

          {/* Pages sans navbar */}
          {/* <Route path="/example" element={<ExamplePage />} /> */}
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}