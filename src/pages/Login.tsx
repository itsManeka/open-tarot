import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import { auth } from '../services/firebase';
import LoginForm from '../components/LoginForm';
import NewsGrid from '../components/NewsGrid';
import './Login.css';

export default function Login() {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const onClickAbout = async () => {
        navigate('/info/historia-do-tarot')
    }

    return (
        <div className="login-page">
            <div className="login-left">
                <img src="/vite.svg" alt="Logo" className="login-logo" />
                <h1 className="login-title">Open Tarot</h1>
                <p className="login-description">
                    O Open Tarot é um site onde você pode realizar tiragem e interpretação de Tarot utilizando a Inteligência da Artificial. Veja aqui como funciona: <Link to="/info/como-funciona" >saiba mais</Link>.
                </p>
            </div>
            <div className="login-right">
                <LoginForm />
            </div>
            <div className="login-info">
                <div className="info-box">
                    <h3>A História do Tarot</h3>
                    <p>O Tarot é muito mais do que um simples conjunto de cartas com imagens misteriosas — ele é um símbolo da busca humana por autoconhecimento, significado e conexão com o invisível. Sua origem envolve enigmas, tradição e transformação cultural ao longo dos séculos.</p>
                    <button onClick={onClickAbout} className="info-button">Saiba mais</button>
                </div>
                <NewsGrid />
            </div>
            <footer className="login-footer">
                {/* Rodapé será implementado no futuro */}
            </footer>
        </div>
    );
}