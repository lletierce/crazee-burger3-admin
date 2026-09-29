import { useState } from "react";
import { sendRecoveryEmail } from "./api-recovery-password";

const STATUS = {
  IDLE: 'default',
  SEND: 'send',
  ERROR: 'error',
} as const;

type QueryStatus = (typeof STATUS)[keyof typeof STATUS];

export function useRecoveryPassword() {
  const [status, setStatus] = useState<QueryStatus>(STATUS.IDLE);
  const [loading, setLoading] = useState(false);

  const handleRecoveryPassword = async (email: string) => {
    setLoading(true);
    try {
      await sendRecoveryEmail(email);
      setStatus(STATUS.SEND);
    } catch {
      setStatus(STATUS.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => setStatus(STATUS.IDLE);

  return { status, loading, handleRecoveryPassword, reset };
}