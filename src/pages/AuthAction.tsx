import { useEffect, useState } from "react";
import { getAuth, applyActionCode, verifyPasswordResetCode } from "firebase/auth";
import { useSearchParams } from "react-router-dom";
import './AuthAction.css';

const AuthAction = () => {
    const auth = getAuth();
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState("Carregando...");
    const [redirectUrl] = useState(import.meta.env.VITE_REDIRECT_URL || "https://opentarot.net");

    useEffect(() => {
        const mode = searchParams.get('mode');
        const oobCode = searchParams.get('oobCode');

        if (!mode || !oobCode) {
            setMessage("Parâmetros inválidos.");
            return;
        }

        switch (mode) {
            case "verifyEmail":
                applyActionCode(auth, oobCode)
                    .then(() => {
                        setMessage("Seu e-mail foi confirmado com sucesso!");
                    })
                    .catch(() => {
                        setMessage("Falha ao confirmar seu e-mail. Talvez ele já tenha sido confirmado.");
                    });
                break;

            case "resetPassword":
                verifyPasswordResetCode(auth, oobCode)
                    .then(() => {
                        setMessage("Código de redefinição válido. Redirecionando...");
                        setTimeout(() => {
                            window.location.href = `${redirectUrl}/reset-password?oobCode=${oobCode}`;
                        }, 2000);
                    })
                    .catch(() => {
                        setMessage("Código de redefinição inválido ou expirado.");
                    });
                break;

            default:
                setMessage("Ação desconhecida.");
        }
    }, [auth, searchParams]);

    return (
        <div className="auth-action-container">
            <h1>{message}</h1>
            {message.includes("sucesso") && (
                <button
                    className="auth-action-button"
                    onClick={() => window.location.href = redirectUrl}
                >
                    Ir para o OpenTarot
                </button>
            )}
        </div>
    );
};

export default AuthAction;
