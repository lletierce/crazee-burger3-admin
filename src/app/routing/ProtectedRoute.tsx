import { Navigate, Outlet } from "react-router";
import LoadingFull from "../../shared/ui/loader/LoadingFull";
import { useAuth } from "../providers/use-auth";

export default function ProtectedRoute() {

    const { user, authLoading } = useAuth()

    if (authLoading) {
        return <LoadingFull />;
    }

    return user ?
        <Outlet />
        : <Navigate to="/login" replace />;

}