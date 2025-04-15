import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate } from "react-router-dom";
import { auth } from "../services/firebase";
import Loading from "./Loading";

export default function AuthGuard({ children }: { children: React.ReactElement }) {
    const [user, loading] = useAuthState(auth);

    if (loading) {
        return (<Loading />);
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}