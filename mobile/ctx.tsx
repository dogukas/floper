import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

type AuthContextType = {
    session: Session | null;
    isLoading: boolean;
    signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({
    session: null,
    isLoading: true,
    signOut: () => { },
});

export function useSession() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setIsLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                session,
                isLoading,
                signOut: () => supabase.auth.signOut(),
            }}>
            {children}
        </AuthContext.Provider>
    );
}
