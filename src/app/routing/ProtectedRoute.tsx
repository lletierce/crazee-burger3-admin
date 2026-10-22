import { Navigate, Outlet } from "react-router";
import { useAuth } from "../providers/use-auth";
import type { ReactNode } from "react";
import { useDelayedFlag } from "../../shared/hooks/useDelayedFlag";
import PageBackdrop from "../../shared/ui/layouts/PageBackdrop";

interface ProtectedRouteProps {
    /** Écran d'attente (skeleton) pendant la vérification de session. */
    fallback: ReactNode;
}

export default function ProtectedRoute({ fallback }: ProtectedRouteProps) {

    const { user, authLoading } = useAuth();

    // Le skeleton n'apparaît que si la vérification dure plus de 300 ms.
    // Avant, on n'affiche que le fond : une vérification rapide passe
    // directement du fond à la page, sans loader qui clignote.
    const showFallback = useDelayedFlag(authLoading);

    if (authLoading) {
        return showFallback ? fallback : <PageBackdrop />;
    }

    return user ?
        <Outlet />
        : <Navigate to="/login" replace />;

}