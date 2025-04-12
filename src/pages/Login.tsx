import { auth, db, provider } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const loginEmail = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch {
            alert('Erro ao logar');
        }
    };

    const registerEmail = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/profile');
        } catch {
            alert('Erro ao registrar');
        }
    };

    const loginGoogle = async () => { 
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
        <div className="login-container">
            <h2 className="login-title">Login / Cadastro</h2>
            <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                className="login-input"
            />
            <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Senha"
                className="login-input"
            />
            <button onClick={loginEmail} className="login-button">Entrar</button>
            <button onClick={registerEmail} className="login-button">Cadastrar</button>
            <button onClick={loginGoogle} className="login-button">Login com Google</button>
        </div>
    );
}
