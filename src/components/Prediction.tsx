import { Link } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { StringHelper } from '../utils/stringHelper';
import { sendMessageToAI } from "../services/aiEngine";
import { PromptHelper } from "../utils/promptHelper";
import './Prediction.css';
import { getBrazilDate } from '../utils/dateHelper';
import ShareableWrapper from './ShareableWrapper';

export default function Prediction() {
    const [user] = useAuthState(auth);
    const [signo, setSigno] = useState<any | null>(null);
    const [prediction, setPrediction] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchPredictions = async () => {
            setIsLoading(true);
            try {

                if (!user || !isMounted) return;

                const hoje = getBrazilDate();
                
                const mapaRef = doc(db, 'users', user.uid, 'mapa_astral', 'data');
                const mapaSnap = await getDoc(mapaRef);

                if (mapaSnap.exists()) {
                    const data = mapaSnap.data()
                    const result = data.mapa.astros.find((astro: any) => astro.nome === "Sol");
                    const signoEncontrado = result.signo; 
                    
                    setSigno(signoEncontrado);

                    const predictRef = doc(db, 'daily_predictions', `${signoEncontrado}_${hoje}`);
                    const predictSnap = await getDoc(predictRef);

                    if (predictSnap.exists()) {
                        const predictionData = predictSnap.data();
                        setPrediction(predictionData.prediction);
                    } else {
                        const prompt = PromptHelper.generateSignPredictionPrompt(signoEncontrado);
                        const novaPredicao = await sendMessageToAI(prompt);
                        await setDoc(predictRef, {
                            prediction: novaPredicao,
                            signo: signoEncontrado,
                            data: hoje
                        });
                        setPrediction(novaPredicao);
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar previsões: ", error);
            }
            setIsLoading(false);
        };

        fetchPredictions();
        return () => { isMounted = false; };
    }, [user]);

    return (
        <div className="prediction-container">
            {isLoading ? (
                <div className="prediction-loading-content">
                    <img
                        src={`/assets/animations/loading.svg`}
                        alt={`Carregando...`}
                        className="prediction-loading-image"
                    />
                </div>
            ) : (
                <ShareableWrapper
                    title='Previsão do dia'
                    text={`Previsão do dia para o signo de ${signo || ''} em opentarot.net`}
                    showButtons={!signo}
                >
                    <div className="prediction-content">
                        <h2>Previsão do dia</h2>
                        {signo ? (
                            <div className="prediction-map-content">
                                <div className="prediction-signo-box">
                                    <img
                                        src={`/assets/signos/${StringHelper.strNormalize(signo).toLowerCase()}.svg`}
                                        alt={`Signo Solar: ${signo}`}
                                        className="prediction-signo-image"
                                    />
                                    <p className="prediction-signo-nome">{signo}</p>
                                </div>
                                <p>{prediction || 'Nenhuma previsão disponível no momento.'}</p>
                            </div>
                        ) : (
                            <div className="prediction-map-content">
                                <p className="prediction-info">
                                    Preencha o <Link to="/profile" className="prediction-info-link">seu perfil</Link> com data, horário e local de nascimento para saber a previsão diária para seu signo.
                                </p>
                            </div>
                        )}
                    </div>
                </ShareableWrapper>
            )}
        </div>
    );
}