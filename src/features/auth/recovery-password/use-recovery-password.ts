import { useState } from "react";
import { resetPassword } from "./api-recovery-password";

export function useRecoveryPassword() {

    const STATUS = {
        IDLE: 'default',
        SEND: 'send',
        ERROR: 'error',
    } as const;
    // type QueryStatus = 'default' | 'send' | 'error';
    type QueryStatus = (typeof STATUS)[keyof typeof STATUS];

    const [status, setStatus] = useState<QueryStatus>(STATUS.IDLE);

    const handleRecoveryPassword = async (email: string) => {
        try {
            await resetPassword(email);
            setStatus(STATUS.SEND);

        } 
        catch (error) {
            setStatus(STATUS.ERROR);
        }
    };

    const reset = () => {
        setStatus(STATUS.IDLE);
    };

    return {
        status,
        handleRecoveryPassword,
        reset,
    };
}