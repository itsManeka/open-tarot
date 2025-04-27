import { useState, useEffect } from 'react';
import { auth, db, provider } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { sendEmailVerification, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuthErrorMessage } from '../utils/firebaseErrors';
import { User } from "firebase/auth";
import './LoginForm.css';

export default function LoginForm() {
    const [user] = useAuthState(auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [verificationUser, setVerificationUser] = useState<User | null>(null);

    const [isRegister, setIsRegister] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showResendVerification, setShowResendVerification] = useState(false);

    const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string; general?: string; google?: string }>({});
    const [alerts, setAlerts] = useState<{ email?: string; password?: string; confirmPassword?: string; general?: string; google?: string }>({});
    const [status, setStatus] = useState<{ email?: string; password?: string; confirmPassword?: string; general?: string; google?: string }>({});

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const cleanMessages = async () => {
        setErrors({});
        setStatus({});
        setAlerts({});
    }

    const handleVerification = async (user: User) => {
        setShowResendVerification(true);
        setVerificationUser(user);
    }

    const handleLogin = async () => {
        if (!email || !password) {
            setErrors({general: 'Preencha todos os campos.'});
            return;
        }
        setIsLoading(true);
        cleanMessages();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (user && !user.emailVerified) {
                handleVerification(user);
                await auth.signOut();
                setAlerts({ general: 'Email não verificado. Por favor, verifique seu email.' });
                setIsLoading(false);
                return;
            }

            const profileRef = doc(db, 'profile', user.uid);
            const profileSnap = await getDoc(profileRef);

            if (profileSnap.exists()) {
                navigate('/');
            } else {
                navigate('/profile');
            }
        } catch (error: any) {
            const message = getAuthErrorMessage(error);
            setErrors({ general: message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            setErrors({general: 'Preencha todos os campos.'});
            return;
        }

        if (password !== confirmPassword) {
            setErrors({confirmPassword: 'As senhas não coincidem'});
            return;
        }

        setIsLoading(true);
        cleanMessages();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            if (userCredential.user) {
                await sendEmailVerification(userCredential.user);
                handleVerification(userCredential.user);
                setIsRegister(false);
                setStatus({general: 'Cadastro realizado! Verifique seu e-mail antes de continuar.'});
                return;
            }

            navigate('/profile');
        } catch (error: any) {
            const message = getAuthErrorMessage(error);
            setErrors({ general: message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        cleanMessages();

        try {
            await signInWithPopup(auth, provider);

            const user = auth.currentUser;
            if (user) {
                const profileRef = doc(db, 'profile', user.uid);
                const profileSnap = await getDoc(profileRef);

                if (profileSnap.exists()) {
                    navigate('/');
                } else {
                    navigate('/profile');
                }
            }
        } catch {
            setErrors({google: 'Erro ao logar com Google.'});
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        isRegister ? handleRegister() : handleLogin()
    };

    const handleResendEmailVerification = async () => {
        setIsLoading(true);
        cleanMessages();

        try {
            if (verificationUser && !verificationUser.emailVerified) {
                await sendEmailVerification(verificationUser);
                setStatus({general: 'Email de verificação reenviado!'});
            }
        } catch {
            setErrors({general: 'Erro ao enviar verificação.'});
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            className="login-form"
        >
            <h3>{isRegister ? 'Cadastrar' : 'Entrar'}</h3>
            <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="login-form-input"
                autoComplete="email"
            />
            {errors.email && <small className="login-form-error">{errors.email}</small>}
            {status.email && <small className="login-form-status">{status.email}</small>}
            {alerts.email && <small className="login-form-alert">{alerts.email}</small>}
            <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                className="login-form-input"
                autoComplete={isRegister ? "new-password" : "current-password"}
            />
            {errors.password && <small className="login-form-error">{errors.password}</small>}
            {status.password && <small className="login-form-status">{status.password}</small>}
            {alerts.password && <small className="login-form-alert">{alerts.password}</small>}
            <input
                type="password"
                name="confirm-password"
                value={confirmPassword}
                style={{ display: isRegister ? "" : "None" }}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a senha"
                className="login-form-input"
                autoComplete="new-password"
            />
            {errors.confirmPassword && <small className="login-form-error">{errors.confirmPassword}</small>}
            {status.confirmPassword && <small className="login-form-status">{status.confirmPassword}</small>}
            {alerts.confirmPassword && <small className="login-form-alert">{alerts.confirmPassword}</small>}
            <button
                type="submit"
                className="login-form-button"
                onClick={handleSubmit}
                disabled={isLoading}
            >
                {isLoading ? 'Aguarde...' : (isRegister ? 'Cadastrar' : 'Entrar')}
            </button>
            {showResendVerification && (
                <button
                    type="button"
                    onClick={handleResendEmailVerification}
                    className="login-form-button"
                    disabled={isLoading}
                >
                    Reenviar verificação
                </button>
            )}
            {errors.general && <small className="login-form-error">{errors.general}</small>}
            {status.general && <small className="login-form-status">{status.general}</small>}
            {alerts.general && <small className="login-form-alert">{alerts.general}</small>}
            <div className="login-form-links">
                <span onClick={() => setIsRegister(false)} className={!isRegister ? 'active' : ''}>
                    Entrar
                </span>
                {' | '}
                <span onClick={() => setIsRegister(true)} className={isRegister ? 'active' : ''}>
                    Cadastrar
                </span>
            </div>
            <p className="login-form-or">ou</p>
            <button
                type="button"
                onClick={handleGoogleLogin}
                className="login-form-button google"
                disabled={isLoading}
            >
                {isLoading ? 'Aguarde...' : 'Login com Google'}
            </button>
            {errors.google && <small className="login-form-error">{errors.google}</small>}
            {status.google && <small className="login-form-status">{status.google}</small>}
            {alerts.google && <small className="login-form-alert">{alerts.google}</small>}
        </form>
    );
}