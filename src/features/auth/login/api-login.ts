import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../app/firebase/firebase-config";

export const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);