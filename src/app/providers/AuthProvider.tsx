import {
    createContext,
    useContext,
    useEffect,
    useState
} from 'react'

import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../firebase/firebase-config'


interface AuthContextType {
    user: User | null
    authLoading?: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

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

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error(
            'useAuth must be used inside AuthProvider'
        )
    }

    return context
}