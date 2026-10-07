import { useEffect, useState} from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../firebase/firebase-config'
import { AuthContext } from './auth-context';


export function AuthProvider({ children }: { children: React.ReactNode}) {

    const [user, setUser] = useState<User | null>(null)
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setAuthLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, authLoading }}>
            {children}
        </AuthContext.Provider>
    )
}