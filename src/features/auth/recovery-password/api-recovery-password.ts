import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../app/firebase/firebase-config";

export const resetPassword = async (email: string) => {
    // return await sendPasswordResetEmail(auth, email);
        return await sendPasswordResetEmail(auth, email, {url: "http://localhost:5173/login"}); 
}