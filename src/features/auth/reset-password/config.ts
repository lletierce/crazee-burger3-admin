import type { Status } from "./use-reset-password";

type LogoVariant = "default" | "success" | "error";

type StatusConfig = {
  title: string;
  logo: LogoVariant;
};

export const config: Record<Status, StatusConfig> = {
  idle: {
    title: "Changement du mot de passe",
    logo: "default",
  },
  loading: {
    title: "Traitement en cours",
    logo: "default",
  },
  success: {
    title: "Mot de passe modifié avec succès",
    logo: "success",
  },
  error: {
    title: "Erreur rencontrée",
    logo: "error",
  },
  invalid: {
    title: "Lien de réinitialisation invalide",
    logo: "error",
  },
};