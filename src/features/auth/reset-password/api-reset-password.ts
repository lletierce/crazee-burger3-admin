import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../../../app/firebase/firebase-config";

export const confirmReset = async (code: string, newPassword: string) => {
  await confirmPasswordReset(auth, code, newPassword);
};