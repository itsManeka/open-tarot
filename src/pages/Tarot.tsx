import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase"
import { useEffect, useState, useRef } from "react";
import { tarotDeck, TarotCard } from "../data/tarotDeck";
import { sendMessageToAI } from "../services/aiEngine";
import { PromptHelper } from "../utils/promptHelper";
import "./Tarot.css";

type RevealedCard = {
    card: TarotCard;
    interpretation: string;
};

export default function Tarot() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const question = location.state?.question;
    const [conclusion, setConclusion] = useState("");
    const [isFinalized, setIsFinalized] = useState(false);
    const [user] = useAuthState(auth);
    const [isSaved, setIsSaved] = useState(false);
    const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
    const [revealedCards, setRevealedCards] = useState<RevealedCard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

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
            await addDoc(collection(db, "readings"), {
                uid: user.uid,
                timestamp: Timestamp.now(),
                cards: revealedCards.map((c) => ({
                    number: c.card.number,
                    name: c.card.name,
                    interpretation: c.interpretation,
                })),
                conclusion: conclusion,
            });
            setIsSaved(true);
        } catch (error: any) {
            console.error("Erro ao salvar tiragem:", error.message);
            alert("Erro ao salvar tiragem: " + error.message);
        }
        setIsLoading(false);
    };

    const readConclusion = async () => {
        setIsLoading(true);

        const prompt = PromptHelper.generateTarotPrompt(
            question || "Sem pergunta",
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
        if (currentIndex >= selectedCards.length) return;
        const currentCard = selectedCards[currentIndex];

        setIsLoading(true);

        const prompt = PromptHelper.generateTarotPrompt(
            question || "Sem pergunta",
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

    return (
        <div className="tarot-container">
            {/* Título no topo */}
            <h2 className="tarot-titulo">Leitura</h2>

            {/* Pergunta */}
            <div className="question-box">
                <p className="question-text">{question || "Sem pergunta definida"}</p>
            </div>

            {/* Cartas */}
            <div className="table-box">
                <div className="cards-container">
                    {selectedCards.map((card, index) => {
                        const revealed = revealedCards[index];
                        const isFlipped = index < currentIndex;
                        const imgSrc = revealed ? card.image : "/assets/tarot/back.jpg";
                        return (
                            <div key={index} className={`card-container ${isFlipped ? "flipped" : ""}`}>
                                <div className="card">
                                    <div className="card-front">
                                        <img
                                            src={imgSrc}
                                            alt={revealed ? card.name : "Carta virada"}
                                            className="card-image"
                                        />
                                    </div>
                                    <div className="card-back">
                                        <img
                                            src="/assets/tarot/back.jpg"
                                            alt="Carta virada"
                                            className="card-image"
                                        />
                                    </div>
                                </div>
                                <p className="card-name">
                                    {revealed ? card.name : "Carta não revelada"}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Interpretações */}
            <div className="interpretations-container">
                {revealedCards.map((c, i) => (
                    <div key={i} className="interpretation-box">
                        <strong>Carta {i + 1}: {c.card.name}</strong>
                        <p>{c.interpretation}</p>
                    </div>
                ))}
                {isFinalized && (
                    <div className="interpretation-box">
                        <strong>Conclusão:</strong>
                        <p>{conclusion}</p>
                    </div>
                )}
            </div>

            {/* Botão para revelar próxima carta */}
            {!isFinalized && (
                <div className="button-container" ref={scrollRef}>
                    <button
                        onClick={currentIndex > 2 ? readConclusion : handleReveal}
                        disabled={isLoading}
                        className="reveal-button"
                    >
                        {isLoading ? "Interpretando..." : currentIndex > 2 ? "Conclusão" : "Revelar próxima carta"}
                    </button>
                </div>
            )}

            {/* Botão para salvar no histórico */}
            {isFinalized && !isSaved && (
                <div className="button-container" ref={scrollRef}>
                    <button
                        onClick={saveReading}
                        disabled={isLoading}
                        className="reveal-button"
                    >
                        {isLoading ? "Salvando..." : "Salvar no histórico"}
                    </button>
                    <button
                        onClick={newReading}
                        className="reveal-button"
                    >
                        Nova Leitura
                    </button>
                </div>
            )}

            {isSaved && (
                <div className="question-box">
                    Tiragem salva com sucesso!
                </div>
            )}

            {isSaved && (
                <div className="button-container" ref={scrollRef}>
                    <button
                        onClick={history}
                        className="reveal-button"
                    >
                        Ir para histórico
                    </button>
                    <button
                        onClick={newReading}
                        className="reveal-button"
                    >
                        Nova leitura
                    </button>
                </div>
            )}
        </div>
    );
}
