import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import { auth } from '../services/firebase';
import LoginForm from '../components/LoginForm';
import './Login.css';

export default function Login() {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <div className="login-page">
            <div className="login-left">
                <img src="/vite.svg" alt="Logo" className="login-logo" />
                <h1 className="login-title">Open Tarot</h1>
                <p className="login-description">
                    O OpenTarot é um site onde você pode realizar tiragem e interpretação de Tarot utilizando a inteligência da IA. Veja aqui como funciona: <a href="/como-funciona">Saiba mais</a>
                </p>
            </div>
            <div className="login-right">
                <LoginForm />
            </div>
            <div className="login-info">
                <div className="info-box">
                    <h3>O que é Tarot?</h3>
                    <p>O Tarot é uma ferramenta de autoconhecimento e orientação. Ele utiliza cartas simbólicas para ajudar na interpretação de situações e decisões.</p>
                    <button className="info-button">Saiba mais</button>
                </div>
                <div className="news-box">
                <h3>Novidades</h3>
                <div className="news-container">
                    {[
                        { id: 1, title: 'Novidade 1', image: '/images/novidade1.jpg', link: '/novidade-1' },
                        { id: 2, title: 'Novidade 2', image: '/images/novidade2.jpg', link: '/novidade-2' },
                        { id: 3, title: 'Novidade 3', image: '/images/novidade3.jpg', link: '/novidade-3' },
                        { id: 4, title: 'Novidade 4', image: '/images/novidade4.jpg', link: '/novidade-4' },
                        { id: 5, title: 'Novidade 5', image: '/images/novidade5.jpg', link: '/novidade-5' },
                        { id: 6, title: 'Novidade 6', image: '/images/novidade6.jpg', link: '/novidade-6' },
                    ].map((news) => (
                        <button
                            key={news.id}
                            className="news-item"
                            onClick={() => window.location.href = news.link}
                        >
                            <div className="news-image" style={{ backgroundImage: `url(${news.image})` }}></div>
                            <div className="news-title">{news.title}</div>
                        </button>
                    ))}
                </div>
            </div>
            </div>
            <footer className="login-footer">
                {/* Rodapé será implementado no futuro */}
            </footer>
        </div>
    );
}