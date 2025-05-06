import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { collection, addDoc, Timestamp, doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase"
import { useEffect, useState, useRef } from "react";
import { tarotDeck, TarotCard } from "../data/tarotDeck";
import { sendMessageToAI } from "../services/aiEngine";
import { PromptHelper } from "../utils/promptHelper";
import { useTokens  } from "../context/TokenProvider";
import AmzBanner from "../components/AmzBanner";
import { NiceHelmet } from "../components/NiceHelmet";
import { UserProfile } from '../types/types';
import { AstrologicalChartData } from '../types/astrologicalChartsTypes';
import Loading from "../components/Loading";

import "./Tarot.css";

type RevealedCard = {
    card: TarotCard;
    interpretation: string;
};

export default function Tarot() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const [user] = useAuthState(auth);
    const location = useLocation();
    const navigate = useNavigate();

    const question = location.state?.question;

    const [isLoading, setIsLoading] = useState(false);
    const [isFinalized, setIsFinalized] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const [conclusion, setConclusion] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [message, setMessage] = useState('');

    const [userProfile, setUserProfile] = useState<UserProfile>();
    const [userAstrologicalChart, setUserAstrologicalChart] = useState<AstrologicalChartData>();
    const [isFetching, setisFetching] = useState(false);

    const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
    const [revealedCards, setRevealedCards] = useState<RevealedCard[]>([]);
    
    const { useToken, tokens } = useTokens();

    useEffect(() => {
        if (!question) {
            navigate('/question');
        }
    }, [question, navigate]);

    useEffect(() => {
        const shuffled = [...tarotDeck].sort(() => Math.random() - 0.5);
        setSelectedCards(shuffled.slice(0, 3));
    }, []);

    useEffect(() => {
        if ((revealedCards.length > 0) || isSaved || isFinalized) {
            scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [revealedCards, isSaved, isFinalized]);
            
    useEffect(() => {
        if (!user) return;
        
        setisFetching(true);

        const fetchProfile = async () => {
            try {
                const profileRef = doc(db, 'users', user.uid, 'profile', 'data');
                const profileSnap = await getDoc(profileRef);

                if (profileSnap.exists()) {
                    setUserProfile(profileSnap.data() as UserProfile);
                }
            } catch (e) {
                console.error("Erro ao carregar perfil.");
            }
        };

        fetchProfile();
        
        const fetchMapa = async () => {
            try {
                const mapaRef = doc(db, "users", user.uid, "mapa_astral", "data");
                const mapaSnap = await getDoc(mapaRef);

                if (mapaSnap.exists()) {
                    setUserAstrologicalChart(mapaSnap.data().mapa as AstrologicalChartData);
                }
            } catch (e) {
                console.error("Erro ao carregar mapa astral.");
            }
        };

        fetchMapa();
        
        setisFetching(false);
    }, [user]);

    const newReading = async () => {
        navigate('/question');
    }

    const history = async () => {
        if (!user) return;
        navigate('/history');
    }

    const saveReading = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            await addDoc(collection(db, "users", user.uid, "readings"), {
                type: "tarot",
                timestamp: Timestamp.now(),
                cards: revealedCards.map((c) => ({
                    number: c.card.number,
                    name: c.card.name,
                    interpretation: c.interpretation,
                })),
                conclusion: conclusion,
                question: question,
            });
            setIsSaved(true);
        } catch (error: any) {
            console.error("Erro ao salvar tiragem:", error.message);
            showMessage("Erro ao salvar tiragem.");
        }
        setIsLoading(false);
    };

    const readConclusion = async () => {
        setIsLoading(true);

        const prompt = PromptHelper.generateTarotPrompt(
            question || "Sem pergunta",
            userProfile,
            userAstrologicalChart,
            revealedCards.map((c) => ({
                name: c.card.name,
                interpretation: c.interpretation,
            })),
            "",
            true
        );
        const interpretation = await sendMessageToAI(prompt);
        
        setConclusion(interpretation);
        setIsFinalized(true);
        setIsLoading(false)
    }

    const handleReveal = async () => {
        if (currentIndex == 0) {
            if (tokens == null || tokens == undefined) {
                showMessage("Aguarde um momento até que suas fichas sejam carregadas.");
                return;
            } else if (tokens < 1) {
                showMessage("Você não tem fichas suficientes.");
                return;
            }
        }

        if (currentIndex >= selectedCards.length) return;
        const currentCard = selectedCards[currentIndex];

        setIsLoading(true);

        if (currentIndex == 0) {
            const success = await useToken();
            if (!success) {
                showMessage("Ocorreu um erro ao realizar a consulta, favor recarregar a página e tentar novamente.");
                setIsLoading(false);
                return;
            }
        }

        const prompt = PromptHelper.generateTarotPrompt(
            question || "Sem pergunta",
            userProfile,
            userAstrologicalChart,
            revealedCards.map((c) => ({
                name: c.card.name,
                interpretation: c.interpretation,
            })),
            currentCard.name,
            false
        );

        const interpretation = await sendMessageToAI(prompt);
        setRevealedCards([
            ...revealedCards,
            { card: currentCard, interpretation },
        ]);
        setCurrentIndex(currentIndex + 1);
        setIsLoading(false);
    };

    const showMessage = async (message: string) => {
        setMessage(message);
        setTimeout(() => setMessage(''), 3000);
    }
            
    if (isFetching) {
        return <Loading />
    }

    return (
        <div className="tarot-container">
            <NiceHelmet
                title={"Open Tarot"}
                meta={[{name: "description", content: "Leitura de Tarot"}]}
            />
            
            <h2 className="tarot-titulo">Leitura</h2>

            <div className="tarot-question-box">
                <p className="tarot-question-text">{question || "Sem pergunta definida"}</p>
            </div>

            <div className="tarot-table-box">
                <div className="tarot-cards-container">
                    {selectedCards.map((card, index) => {
                        const revealed = revealedCards[index];
                        const isFlipped = index < currentIndex;
                        const imgSrc = revealed ? card.image : "/assets/tarot/back.jpg";
                        return (
                            <div key={index} className={`tarot-card-container ${isFlipped ? "flipped" : ""}`}>
                                <div className="tarot-card">
                                    <div className="tarot-card-front">
                                        <img
                                            src={imgSrc}
                                            alt={revealed ? card.name : "Carta virada"}
                                            className="tarot-card-image"
                                        />
                                    </div>
                                    <div className="tarot-card-back">
                                        <img
                                            src="/assets/tarot/back.jpg"
                                            alt="Carta virada"
                                            className="tarot-card-image"
                                        />
                                    </div>
                                </div>
                                <p className="tarot-card-name">
                                    {revealed ? card.name : "Carta não revelada"}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <div className="tarot-interpretations-container">
                {revealedCards.map((c, i) => (
                    <div key={i} className="tarot-interpretation-box">
                        <strong>Carta {i + 1}: {c.card.name}</strong>
                        <p>{c.interpretation}</p>
                    </div>
                ))}
                {isFinalized && (
                    <div className="tarot-interpretation-box">
                        <strong>Conclusão:</strong>
                        <p>{conclusion}</p>
                    </div>
                )}
            </div>
            
            {!isFinalized && (
                <div className="tarot-button-container" ref={scrollRef}>
                    <button
                        onClick={currentIndex > 2 ? readConclusion : handleReveal}
                        disabled={isLoading}
                        className="tarot-reveal-button"
                    >
                        {isLoading ? "Interpretando..." : currentIndex > 2 ? "Conclusão" : "Revelar próxima carta"}
                    </button>
                </div>
            )}
            {message && (
                <small className='tarot-message-error'>{message}</small>
            )}

            {isFinalized && (
                <div className="tarot-question-box">
                    <AmzBanner
                        query="tarot"
                    />
                </div>
            )}
            
            {isFinalized && !isSaved && (
                <div className="tarot-button-container" ref={scrollRef}>
                    <button
                        onClick={saveReading}
                        disabled={isLoading}
                        className="tarot-reveal-button"
                    >
                        {isLoading ? "Salvando..." : "Salvar no histórico"}
                    </button>
                    <button
                        onClick={newReading}
                        className="tarot-reveal-button"
                    >
                        Nova leitura
                    </button>
                </div>
            )}

            {isSaved && (
                <div className="tarot-question-box">
                    Tiragem salva com sucesso!
                </div>
            )}

            {isSaved && (
                <div className="tarot-button-container" ref={scrollRef}>
                    <button
                        onClick={history}
                        className="tarot-reveal-button"
                    >
                        Ir para histórico
                    </button>
                    <button
                        onClick={newReading}
                        className="tarot-reveal-button"
                    >
                        Nova leitura
                    </button>
                </div>
            )}
        </div>
    );
}
