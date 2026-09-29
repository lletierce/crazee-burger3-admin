import { Outlet } from "react-router";
import { useAuth } from "../providers/AuthProvider";
import { getUserDisplayName } from "../../features/auth/get-user-display-name";
import { logout } from "../../features/auth/logout";
import MainLayout from "../../shared/ui/layouts/MainLayout";


export default function AuthenticatedLayout() {
  const { user } = useAuth();

  return (
    <MainLayout userDisplayName={getUserDisplayName(user)} onLogout={logout}>
      <Outlet />
    </MainLayout>
  );
}