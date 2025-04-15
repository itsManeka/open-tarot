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
        } catch {
            alert('Erro ao logar');
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
        } catch {
            alert('Erro ao registrar');
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

    return (
        <div className="login-form">
            <h3>{isRegister ? 'Cadastrar' : 'Entrar'}</h3>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="login-input"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                className="login-input"
            />
            {isRegister && (
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                    className="login-input"
                />
            )}
            <button
                onClick={isRegister ? handleRegister : handleLogin}
                className="login-button"
            >
                {isRegister ? 'Cadastrar' : 'Entrar'}
            </button>
            <div className="login-links">
                <span onClick={() => setIsRegister(false)} className={!isRegister ? 'active' : ''}>
                    Entrar
                </span>
                {' | '}
                <span onClick={() => setIsRegister(true)} className={isRegister ? 'active' : ''}>
                    Cadastrar
                </span>
            </div>
            <p className="login-or">ou</p>
            <button onClick={handleGoogleLogin} className="login-button google">
                Login com Google
            </button>
        </div>
    );
}