import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../app/firebase/firebase-config";

export const sendRecoveryEmail = async (email: string) => {
  await sendPasswordResetEmail(auth, email, {
    url: `${window.location.origin}/login`,
  });
};