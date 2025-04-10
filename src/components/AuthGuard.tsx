import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate } from "react-router-dom";
import { auth } from "../services/firebase";

export default function AuthGuard({ children }: { children: React.ReactElement }) {
    const [user, loading] = useAuthState(auth);

    if (loading) {
        return <p>Carregando...</p>; // Exibe um carregamento enquanto verifica o estado
    }

    if (!user) {
        return <Navigate to="/login" replace />; // Redireciona para login se não estiver logado
    }

    return children; // Renderiza o conteúdo protegido
}