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
    const [mapaAstral, setMapaAstral] = useState<any | null>(null);
    const [prediction, setPrediction] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchPredictions = async () => {
            setIsLoading(true);
            try {

                if (!user || !isMounted) return;

                const hoje = getBrazilDate();
                
                const mapaRef = doc(db, 'mapas_astro', user.uid);
                const mapaSnap = await getDoc(mapaRef);

                if (mapaSnap.exists()) {
                    setMapaAstral(mapaSnap.data());
                    const signo = mapaSnap.data().signos.solar;

                    const predictRef = doc(db, 'daily_predictions', `${signo}_${hoje}`);
                    const predictSnap = await getDoc(predictRef);

                    if (predictSnap.exists()) {
                        const predictionData = predictSnap.data();
                        setPrediction(predictionData.prediction);
                    } else {
                        const prompt = PromptHelper.generateSignPredictionPrompt(signo);
                        const novaPredicao = await sendMessageToAI(prompt);
                        await setDoc(predictRef, {
                            prediction: novaPredicao,
                            signo: signo,
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
                    text={`Previsão do dia para o signo de ${mapaAstral?.signos.solar || ''} em opentarot.net`}
                    showButtons={!!mapaAstral}
                >
                    <div className="prediction-content">
                        <h2>Previsão do dia</h2>
                        {mapaAstral ? (
                            <div className="prediction-map-content">
                                <div className="prediction-signo-box">
                                    <img
                                        src={`/assets/signos/${StringHelper.strNormalize(mapaAstral.signos.solar).toLowerCase()}.svg`}
                                        alt={`Signo Solar: ${mapaAstral.signos.solar}`}
                                        className="prediction-signo-image"
                                    />
                                    <p className="prediction-signo-nome">{mapaAstral.signos.solar}</p>
                                </div>
                                <p>{prediction || 'Nenhuma previsão disponível no momento.'}</p>
                            </div>
                        ) : (
                            <div className="prediction-map-content">
                                <p>Preencha o <Link to="/profile" className="prediction-info-link">seu perfil</Link> com data, horário e local de nascimento para saber a previsão diária para seu signo.</p>
                            </div>
                        )}
                    </div>
                </ShareableWrapper>
            )}
        </div>
    );
}