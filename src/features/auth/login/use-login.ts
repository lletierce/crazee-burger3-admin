import { FirebaseError } from "firebase/app";
import { useState } from "react";
import { login } from "./api-login";


function getLoginErrorMessage(err: unknown): string {
  if (err instanceof FirebaseError) {
    switch (err.code) {
      case 'auth/invalid-credential':
      case 'auth/invalid-email':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Email ou mot de passe incorrect.';
      case 'auth/too-many-requests':
        return 'Trop de tentatives. Réessayez dans quelques minutes.';
      case 'auth/network-request-failed':
        return 'Impossible de joindre le serveur. Vérifiez votre connexion.';
    }
  }
  return 'Une erreur est survenue, veuillez réessayer.';
}

export function useLogin() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      // Pas de navigate() ici : dès que Firebase signale l'utilisateur,
      // AuthProvider met à jour `user` et GuestRoute redirige vers /produits.
    } catch (err) {
      setError(getLoginErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, error, loading };
}