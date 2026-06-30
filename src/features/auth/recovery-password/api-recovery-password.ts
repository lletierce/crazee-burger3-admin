import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../app/firebase/firebase-config";

export const resetPassword = async (email: string) => {

    const actionCodeSettings = {
        url: "http://localhost:5173/reset-password",
        handleCodeInApp: true,
    };
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
}