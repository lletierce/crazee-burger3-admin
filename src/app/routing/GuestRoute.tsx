import { Navigate, Outlet } from "react-router";
import { useAuth } from "../providers/use-auth";
import type { ReactNode } from "react";
import { useDelayedFlag } from "../../shared/hooks/useDelayedFlag";
import PageBackdrop from "../../shared/ui/layouts/PageBackdrop";

interface GuestRouteProps {
  /** Écran d'attente (skeleton) pendant la vérification de session. */
  fallback: ReactNode;
}

export default function GuestRoute({ fallback }: GuestRouteProps) {
  const { user, authLoading } = useAuth();

  // Même principe que ProtectedRoute : fond seul pendant 300 ms, puis skeleton.
  // Fond clair aligné sur celui d'AuthLayout (mobile).
  const showFallback = useDelayedFlag(authLoading);

  if (authLoading) {
    return showFallback ? fallback : <PageBackdrop className="bg-[#f5f5f7]" />;
  }

  // Déjà connecté ? Pas besoin de voir la page de login
  return user ? <Navigate to="/produits" replace /> : <Outlet />;
}