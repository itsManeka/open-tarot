import './DailyCard.css';

import { db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { sendMessageToAI } from "../services/aiEngine";
import { PromptHelper } from "../utils/promptHelper";
import { getBrazilDate } from '../utils/dateHelper';
import { shuffleDeck, TarotCard, tarotDeck } from '../data/tarotDeck';
import ShareableWrapper from './ShareableWrapper';

export default function DailyCard() {
    const [prediction, setPrediction] = useState('');
    const [card, setCard] = useState<TarotCard | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchPredictions = async () => {
            setIsLoading(true);
            try {
                if (!isMounted) return;

                const hoje = getBrazilDate();

                const predictRef = doc(db, 'daily_card', `${hoje}`);
                const predictSnap = await getDoc(predictRef);

                if (predictSnap.exists()) {
                    const predictionData = predictSnap.data();
                    setPrediction(predictionData.prediction);
                    const savedCard = tarotDeck.find((c) => c.number === predictionData.card);
                    setCard(savedCard);
                } else {
                    const card = shuffleDeck(tarotDeck)[0];
                    const prompt = PromptHelper.generateTarotCardOfTheDayPrompt(card.name);
                    const novaPredicao = await sendMessageToAI(prompt);
                    await setDoc(predictRef, {
                        prediction: novaPredicao,
                        card: card.number,
                        data: hoje
                    });
                    setPrediction(novaPredicao);
                    setCard(card)
                }
            } catch (error) {
                console.error("Erro ao buscar previsões: ", error);
            }
            setIsLoading(false);
        };

        fetchPredictions();
        return () => { isMounted = false; };
    }, []);

    return (
        <div className="daily-card-container">
            {isLoading ? (
                <div className="daily-card-loading-content">
                    <img
                        src={`/assets/animations/loading.svg`}
                        alt={`Carregando...`}
                        className="daily-card-loading-image"
                    />
                </div>
            ) : (
                <ShareableWrapper
                    title='Carta do dia'
                    text='Minha carta do dia em opentarot.net'
                >
                    <div className="daily-card-content">
                        <h2>Carta do dia</h2>
                        <div className="daily-card-box">
                            <img
                                src={`${card ? card.image : "/assets/tarot/back.jpg" }`}
                                alt={`Carta do dia: ${card?.name}`}
                                className="daily-card-image"
                            />
                            <div className="daily-card-info-box">
                                <p className="daily-card-nome">{card?.name}</p>
                                <p>{prediction || 'Os astros ainda não revelaram a carta do dia.'}</p>
                            </div>
                        </div>
                    </div>
                </ShareableWrapper>
            )}
        </div>
    );
}