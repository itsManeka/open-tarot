import { Link } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { StringHelper } from '../utils/stringHelper';
import { sendMessageToAI } from "../services/aiEngine";
import { PromptHelper } from "../utils/promptHelper";
import './Prediction.css';

export default function Prediction() {
    const [user] = useAuthState(auth);
    const [mapaAstral, setMapaAstral] = useState<any | null>(null);
    const [prediction, setPrediction] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPredictions = async () => {
            setIsLoading(true);
            try {

                if (!user) return;

                const hoje = new Date();
                const dataFormatada = hoje.toISOString().split('T')[0];
                
                const mapaRef = doc(db, 'mapas_astro', user.uid);
                const mapaSnap = await getDoc(mapaRef);

                if (mapaSnap.exists()) {
                    setMapaAstral(mapaSnap.data());
                    const signo = mapaSnap.data().signos.solar;

                    const predictRef = doc(db, 'daily_predictions', `${signo}_${dataFormatada}`);
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
                            data: dataFormatada
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
    }, [user]);

    return (
        <div className="prediction-container">
            {isLoading ? (
                <div className="loading-content">
                    <img
                        src={`/assets/animations/loading.svg`}
                        alt={`Carregando...`}
                        className="loading-image"
                    />
                </div>
            ) : (
                <div className="prediction-content">
                    <h2>Previsão do diária</h2>
                    {mapaAstral ? (
                        <div className="map-content">
                            <div className="signo-box">
                                <img
                                    src={`/assets/signos/${StringHelper.strNormalize(mapaAstral.signos.solar).toLowerCase()}.svg`}
                                    alt={`Signo Solar: ${mapaAstral.signos.solar}`}
                                    className="signo-image"
                                />
                                <p className="signo-nome">{mapaAstral.signos.solar}</p>
                            </div>
                            <p>{prediction}</p>
                        </div>
                    ) : (
                        <div className="map-content">
                            <p>Preencha o <Link to="/profile" className="question-info-link">seu perfil</Link> com data, horário e local de nascimento para saber a previsão diária para seu signo.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}