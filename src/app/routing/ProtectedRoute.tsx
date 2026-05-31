import { Navigate, Outlet } from "react-router";
import { useAuth } from "../providers/AuthProvider";
import LoadingFull from "../../shared/ui/loader/LoadingFull";

export default function ProtectedRoute() {

    const { user, authLoading } = useAuth()

    if (authLoading) {
        return <LoadingFull />;
    }

    return user ?
        <Outlet />
        : <Navigate to="/login" replace />;

}