import { useNavigate } from 'react-router-dom';
import './TarotLink.css';

export default function TarotLink() {
    const navigate = useNavigate();

    const consultar = async () => {
        navigate('/question');
    };

    return (
        <div className="tarotlink-container">
            <div className="tarotlink-content">
                <h2>Descubra o que o Tarot revela para você!</h2>
                <div className="tarotlink-box">
                    <img
                        src={`/assets/statics/cards.svg`}
                        alt={`Cartas de tarot`}
                        className="tarotlink-image"
                    />
                    <div className="tarotlink-subcontent">
                        <p>{`Conecte-se com sua intuição e explore as mensagens do universo com uma tiragem de tarot online personalizada.
                            Nosso site oferece uma experiência mágica e acessível, onde cada carta traz um novo olhar sobre sua jornada.`}</p>
                        <p>{`Tire um momento para si e receba interpretações únicas através de Inteligência Artificial que podem iluminar seu caminho.`}</p>
                        <button
                            className="tarotlink-button"
                            onClick={consultar}
                        >
                            Comece sua tiragem
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}