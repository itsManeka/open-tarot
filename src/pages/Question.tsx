import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useTokens } from "../context/TokenProvider";
import Loading from '../components/Loading';
import { NiceHelmet } from '../components/NiceHelmet';

import './Question.css';

export default function Question() {
    const navigate = useNavigate();

    const [question, setQuestion] = useState('');
    const [user] = useAuthState(auth);
    const [message, setMessage] = useState('');

    const [isProfileExists, setIsProfileExists] = useState(true);
    const [showShop, setShowShop] = useState(false);
    
    const { tokens, loading } = useTokens();
    
    useEffect(() => {
        if (!user) return;

        const fetchReadings = async () => {
            const profileRef = doc(db, 'users', user.uid, 'profile', 'data');
            const profileSnap = await getDoc(profileRef);

            if (profileSnap.exists()) {
                setIsProfileExists(true);
            }
        };

        fetchReadings();
    }, [user]);

    const continuar = async () => {
        if (tokens == null || tokens == undefined) {
            showMessage("Aguarde um momento até que suas fichas sejam carregadas.");
            return;
        } else if (tokens < 1) {
            showMessage("Você não tem fichas suficientes.");
            setShowShop(true);
            return;
        }

        navigate('/tarot', { state: { question } });
    };

    const showMessage = async (message: string) => {
        setMessage(message);
        setTimeout(() => setMessage(''), 3000);
    }
    
    if (loading) {
        return <Loading />
    }

    return (
        <div className="question-container">
            <NiceHelmet
                title={"Open Tarot"}
                meta={[{name: "description", content: "Sobre qual assunto você quer saber?"}]}
            />
            <div className="question-header">
                <h2 className="question-title">
                    Sobre qual assunto você quer saber?
                </h2>
                <div className='question-token-cost'>
                    <img src='/assets/statics/token.svg' className='question-token-image'/>
                    <p>A consulta custa <strong>1</strong> ficha</p>
                </div>
                {!isProfileExists && (
                    <p className="question-info">
                        Dica: preencha o <Link to="/profile" className="question-info-link">seu perfil</Link> para deixar a leitura mais precisa.
                    </p>
                )}
            </div>
            <textarea
                className="question-textarea"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="Digite a sua pergunta"
            />
            <div className='question-button-container'>
                <button
                    className="question-button"
                    onClick={continuar}
                    disabled={!question.trim()}
                >
                    Consultar
                </button>
                {showShop &&
                    <button
                        className="question-button"
                        onClick={() => navigate('/shop')}
                    >
                        Loja
                    </button>
                }
            </div>
            {message && (
                <small className='question-message-error'>{message}</small>
            )}
        </div>
    );
}
