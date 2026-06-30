import { useState } from "react";
import { confirmReset } from "./api-reset-password";
import { FirebaseError } from "firebase/app";

export type Status = "idle" | "loading" | "success" | "error" | "invalid";

export function useResetPassword() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleResetPassword = async (oobCode: string, password: string) => {
    setStatus("loading");
    setError(null);

    try {
      await confirmReset(oobCode, password);
      setStatus("success");
    } catch (err) {
      if (err instanceof FirebaseError) {
        if (
          err.code === "auth/expired-action-code" ||
          err.code === "auth/invalid-action-code"
        ) {
          setStatus("invalid");
          setError("Ce lien est invalide ou a expiré.");
          return;
        }
      }
      setStatus("error");
      setError("Une erreur est survenue, veuillez réessayer.");
    }
  };

  return { status, error, handleResetPassword };
}