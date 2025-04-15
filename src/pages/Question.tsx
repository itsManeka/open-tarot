import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import './Question.css';

export default function Question() {
    const [question, setQuestion] = useState('');
    const navigate = useNavigate();
    const [user] = useAuthState(auth);
    const [isProfileExists, setIsProfileExists] = useState(false);
    
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
        navigate('/tarot', { state: { question } });
    };

    return (
        <div className="question-container">
            <div className="question-header">
                <h2 className="question-title">
                    Sobre qual assunto você quer saber?
                </h2><br />
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
                Continuar
            </button>
        </div>
    );
}
