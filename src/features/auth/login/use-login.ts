import { useState } from 'react';
import { useNavigate } from 'react-router';
import { login } from './api-login';

export function useLogin() {
    const navigate = useNavigate();

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (
        email: string,
        password: string
    ) => {
        setLoading(true);

        try {
            await login(email, password);
            setError('');
            navigate('/produits');
        } catch (err) {

            setError('LOGIN_FAILURE_MESSAGE');

        } finally {

            setLoading(false);
        }
    };

    const moveToRecovery     = () => {
        navigate('/recovery');
    }

    return {
        handleLogin,
        moveToRecovery,
        error,
        loading
    };
}