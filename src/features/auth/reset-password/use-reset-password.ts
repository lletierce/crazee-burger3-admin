import { useState } from "react";
import { confirmReset } from "./api-reset-password";

export function useResetPassword() {

    const STATUS = {
        IDLE: 'default',
        SUCCESS: 'success',
        ERROR: 'error',
        INVALID: 'invalid',
    } as const;
    type QueryStatus = (typeof STATUS)[keyof typeof STATUS];

    const [status, setStatus] = useState<QueryStatus>(STATUS.IDLE);

    const handleResetPassword = async (oobCode: string, password: string) => {
        
        if (!oobCode) return;

        try {
            await confirmReset(oobCode, password);
            setStatus(STATUS.SUCCESS);
        }
        catch (error) {
            setStatus(STATUS.ERROR);
        }
    }


    const reset = () => {
        setStatus(STATUS.IDLE);
    };

    return {
        status,
        handleResetPassword,
        reset,
    };
}