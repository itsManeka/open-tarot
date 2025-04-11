import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Question.css';

export default function Question() {
    const [question, setQuestion] = useState('');
    const navigate = useNavigate();

    const continuar = async () => {
        navigate('/tarot', { state: { question } });
    };

    return (
        <div className="question-container">
            <h2 className="question-title">
                Sobre qual assunto você quer saber?
            </h2><br />
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
