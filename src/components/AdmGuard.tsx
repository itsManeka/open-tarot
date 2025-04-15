import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate } from "react-router-dom";
import { auth } from "../services/firebase";
import Loading from "./Loading";

export default function AuthGuard({ children }: { children: React.ReactElement }) {
    const [user, loading] = useAuthState(auth);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        if (loading) return;

        if (user && user.uid == import.meta.env.VITE_UUID_ADM) {
            setIsAuthorized(true);
        } else {
            setIsAuthorized(false);
        }

        setIsChecked(true);
    }, [user, loading]);

    if (loading || !isChecked) {
        return (<Loading />);
    }

    if (!isAuthorized) {
        return <Navigate to="/" replace />;
    }

    return children;
}