import { signOut } from "firebase/auth";
import { auth } from "../../app/firebase/firebase-config";

export async function logout() {
  return await signOut(auth)
}