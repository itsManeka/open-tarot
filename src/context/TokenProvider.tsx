import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useAuthState } from "react-firebase-hooks/auth";

type TokenContextType = {
    tokens: number | null;
    nextClaim: Date | null;
    loading: boolean;
    claimToken: () => Promise<boolean>;
    useToken: () => Promise<boolean>;
    fetchTokens: () => Promise<boolean>;
};

const TokenContext = createContext<TokenContextType | null>(null);

export function TokenProvider({ children }: { children: React.ReactNode }) {
    const [user] = useAuthState(auth);
    const [tokens, setTokens] = useState<number | null>(null);
    const [nextClaim, setNextClaim] = useState<Date | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchTokens = async () => {
        setLoading(true);
        try {
            if (!user) {
                setLoading(false);
                return false;
            }

            const token = await user.getIdToken();
            const res = await fetch(`${import.meta.env.VITE_TOKEN_API}/tokens/status`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (res.ok) {
                setTokens(data.amount);
                setNextClaim(
                    data.canClaim ? null : new Date(Date.now() + data.nextClaimIn)
                );
            }
        } catch (e) {
            console.error('fetchTokens error:', e);
            setLoading(false);
            return false;
        }
        setLoading(false);
        return true;
    };

    const claimToken = async () => {
        try {
            if (!user) return false;

            const token = await user.getIdToken();
            const res = await fetch(`${import.meta.env.VITE_TOKEN_API}/tokens/claim`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (res.ok) {
                setTokens(data.amount);
                setNextClaim(new Date(data.nextClaim));
                return true;
            } else if (data.error === 'Too soon') {
                setTokens(data.amount);
                setNextClaim(new Date(data.nextClaim));
            }
        } catch (e) {
            console.error('claimToken error:', e);
        }
        return false;
    };

    const useToken = async () => {
        const user = getAuth().currentUser;
        if (!user) return false;

        const token = await user.getIdToken();
        const res = await fetch(`${import.meta.env.VITE_TOKEN_API}/tokens/use`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
            setTokens(data.amount);
            return true;
        }
        return false;
    };

    useEffect(() => {
        fetchTokens();
    }, [user]);

    useEffect(() => {
        if (!nextClaim) return;

        const now = new Date().getTime();
        const claimTime = nextClaim.getTime();
        const delay = claimTime - now;

        if (delay <= 0) return;

        const timeout = setTimeout(() => {
            fetchTokens();
        }, delay);

        return () => clearTimeout(timeout);
    }, [nextClaim]);

    return (
        <TokenContext.Provider value={{ tokens, nextClaim, loading, claimToken, useToken, fetchTokens }}>
            {children}
        </TokenContext.Provider>
    );
}

export const useTokens = () => {
    const ctx = useContext(TokenContext);
    if (!ctx) throw new Error("useTokens precisa estar dentro de TokenProvider");
    return ctx;
};