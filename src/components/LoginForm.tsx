import { useState, useEffect } from 'react';
import { auth, db, provider } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useAuthState } from "react-firebase-hooks/auth";
import './LoginForm.css';

export default function LoginForm() {
    const [user] = useAuthState(auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (error: any) {
            switch (error.code) {
                case 'auth/invalid-email':
                    alert('Email inválido.');
                    break;
                case 'auth/user-disabled':
                    alert('Usuário desativado.');
                    break;
                case 'auth/user-not-found':
                    alert('Usuário não encontrado.');
                    break;
                case 'auth/wrong-password':
                    alert('Senha incorreta.');
                    break;
                case 'auth/invalid-credential':
                    alert('Credenciais inválidas.');
                    break;
                default:
                    alert(`Erro ao logar: ${error.message}`);
            }
        }
    };

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            alert('As senhas não coincidem');
            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/profile');
        } catch (error: any) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    alert('Este email já está em uso.');
                    break;
                case 'auth/invalid-email':
                    alert('Email inválido.');
                    break;
                case 'auth/weak-password':
                    alert('Senha muito fraca. Use ao menos 6 caracteres.');
                    break;
                default:
                    alert(`Erro ao registrar: ${error.message}`);
            }
        }
    };

    const handleGoogleLogin = async () => {
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
            alert('Erro ao logar com Google');
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        isRegister ? handleRegister() : handleLogin()
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
            <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                className="login-form-input"
                autoComplete={isRegister ? "new-password" : "current-password"}
            />
            <input
                type="password"
                name="confirm-password"
                value={confirmPassword}
                style={{display: isRegister ? "" : "None"}}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a senha"
                className="login-form-input"
                autoComplete="new-password"
            />
            <button
                type="submit"
                className="login-form-button"
                onClick={handleSubmit}
            >
                {isRegister ? 'Cadastrar' : 'Entrar'}
            </button>
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
            >
                Login com Google
            </button>
        </form>
    );
}