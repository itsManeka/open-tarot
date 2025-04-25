import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useTokens } from "../context/TokenProvider";
import './Question.css';

export default function Question() {
    const [question, setQuestion] = useState('');
    const navigate = useNavigate();
    const [user] = useAuthState(auth);
    const [isProfileExists, setIsProfileExists] = useState(false);
    const [message, setMessage] = useState('');
    
    const { tokens } = useTokens();
    
    useEffect(() => {
        if (!user) return;

        const fetchReadings = async () => {
            const profileRef = doc(db, 'profile', user.uid);
            const profileSnap = await getDoc(profileRef);

            if (profileSnap.exists()) {
                setIsProfileExists(true);
            }
        };

        fetchReadings();
    }, [user]);

    const continuar = async () => {
        if (!tokens || tokens < 1) {
            setMessage("Você não tem fichas suficientes.");
            setTimeout(() => setMessage(''), 3000);
            return;
        }
        navigate('/tarot', { state: { question } });
    };

    return (
        <div className="question-container">
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
            <button
                className="question-button"
                onClick={continuar}
                disabled={!question.trim()} /* Desabilita o botão se a pergunta estiver vazia */
            >
                Consultar
            </button>
            {message && (
                <small className='question-message-error'>{message}</small>
            )}
        </div>
    );
}
