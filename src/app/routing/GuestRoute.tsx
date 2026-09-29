import { Navigate, Outlet } from "react-router";
import { useAuth } from "../providers/AuthProvider";
import LoadingFull from "../../shared/ui/loader/LoadingFull";

export default function GuestRoute() {
  const { user, authLoading } = useAuth();

  if (authLoading) return <LoadingFull />;

  // Déjà connecté ? Pas besoin de voir la page de login
  return user ? <Navigate to="/produits" replace /> : <Outlet />;
}