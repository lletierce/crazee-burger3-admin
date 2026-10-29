import { Outlet, useLocation, useNavigate } from "react-router";
import { getUserDisplayName } from "../../features/auth/get-user-display-name";
import { logout } from "../../features/auth/logout";
import MainLayout from "../../shared/ui/layouts/MainLayout";
import { useAuth } from "../providers/use-auth";
import { useState } from "react";
import { useFlashMessage } from "../../shared/hooks/useFlashMessage";
import { IS_DEMO_MODE } from "../../features/products/demo/demo.config";
import { DemoModeBadge } from "../../features/products/demo/DemoModeBadge";
import { Toast } from "../../shared/ui/components/Toast";


export default function AuthenticatedLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { message: flashMessage, show: showFlashMessage, clear: clearFlashMessage } = useFlashMessage();

  // Changer cette valeur remonte la page affichée (via la `key` de <Outlet />) :
  // elle recharge alors ses données depuis Firestore, comme à la première visite.
  const [catalogVersion, setCatalogVersion] = useState(0);

  function handleDemoReset() {
    setCatalogVersion((version) => version + 1);
    // Depuis une fiche produit, on revient au catalogue : le produit affiché
    // a pu être supprimé par la réinitialisation.
    if (location.pathname !== "/produits") {
      navigate("/produits");
    }
    showFlashMessage("Catalogue de démonstration restauré");
  }

  return (
    <>
      <MainLayout userDisplayName={getUserDisplayName(user)} onLogout={logout}>
        <Outlet key={catalogVersion} />
      </MainLayout>

      {IS_DEMO_MODE && <DemoModeBadge onReset={handleDemoReset} />}
      {flashMessage && <Toast message={flashMessage} onDismiss={clearFlashMessage} />}
    </>
  );
}