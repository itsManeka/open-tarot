import { useEffect, useState } from "react";
import { db, auth } from "../services/firebase";
import {
    collection,
    query,
    where,
    getDocs,
    orderBy,
    deleteDoc,
    doc
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import "./History.css";
import { tarotDeck } from "../data/tarotDeck";

type SavedCard = {
    name: string;
    interpretation: string;
    number: number;
};

type TarotReading = {
    id: string;
    type?: "tarot";
    timestamp: any;
    cards: SavedCard[];
    conclusion: string;
    question?: string;
};

type DreamReading = {
    id: string;
    type: "dream";
    timestamp: any;
    description: string;
    interpretation: string;
};

type Reading = TarotReading | DreamReading;

export default function History() {
    const [user] = useAuthState(auth);
    const [readings, setReadings] = useState<Reading[]>([]);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<"all" | "tarot" | "dream">("all");


    const fetchReadings = async () => {
        if (!user) return;

        const q = query(
            collection(db, "readings"),
            where("uid", "==", user.uid),
            orderBy("timestamp", "desc")
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Reading[];

        setReadings(data);
    };

    useEffect(() => {
        fetchReadings();
    }, [user]);

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta tiragem?")) return;
        await deleteDoc(doc(db, "readings", id));
        fetchReadings();
    };

    const filteredReadings = readings.filter((reading) => {
        const searchLower = search.toLowerCase();

        const matchesSearch = "cards" in reading
            ? reading.cards.some((card) =>
                card.name.toLowerCase().includes(searchLower)
            ) || reading.question?.toLowerCase().includes(searchLower)
            : reading.description.toLowerCase().includes(searchLower) ||
            reading.interpretation.toLowerCase().includes(searchLower);

        const matchesType = typeFilter === "all" || (typeFilter === "tarot" && "cards" in reading) || (typeFilter === "dream" && !("cards" in reading));

        return matchesSearch && matchesType;
    });

    return (
        <div className="history-container">
            <h2 className="history-title">Histórico</h2>

            <div className="history-filters">
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as "all" | "tarot" | "dream")}
                    className="history-type-filter"
                >
                    <option value="all">Todos</option>
                    <option value="tarot">Apenas tiragens de tarot</option>
                    <option value="dream">Apenas interpretações de sonho</option>
                </select>

                <input
                    type="text"
                    placeholder="Filtrar por carta, pergunta ou sonho..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="history-filter"
                />
            </div>

            {filteredReadings.length === 0 && (
                <p className="history-empty">Nenhuma registro encontrado.</p>
            )}

            {filteredReadings.map((reading) => (
                <div key={reading.id} className="history-reading-box">
                    <div className="history-reading-header">
                        <span className={`history-type-tag ${"cards" in reading ? "tarot" : "dream"}`}>
                            { "cards" in reading ? "TAROT" : "SONHO" }
                        </span>
                        
                        <span className="history-date">
                            {new Date(reading.timestamp.seconds * 1000).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                            })}
                        </span>
                        <button
                            className="history-delete"
                            onClick={() => handleDelete(reading.id)}
                        >
                            Excluir
                        </button>
                    </div>

                    {"cards" in reading ? (
                        <>
                            {reading.question && (
                                <p className="history-question"><strong>Pergunta:</strong> {reading.question}</p>
                            )}

                            {reading.cards.map((card, idx) => (
                                <div key={idx} className="history-card-box">
                                    <div className="history-card-info">
                                        <img
                                            src={tarotDeck.find((tarotCard) => tarotCard.number === card.number)?.image || "/assets/default.jpg"}
                                            alt={card.name}
                                            className="history-card-img"
                                        />
                                        <div>
                                            <p className="history-card-name">Carta {idx + 1}: {card.name}</p>
                                            <p className="history-card-interpretation">{card.interpretation}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {reading.conclusion && (
                                <div className="history-card-box">
                                    <p className="history-card-name">Conclusão:</p>
                                    <p className="history-card-interpretation">{reading.conclusion}</p>
                                </div>
                            )}
                        </>

                    ) : (
                        <>
                            <p className="history-question"><strong>Relato:</strong> {reading.description}</p>
                            <div className="history-card-box">
                                <p className="history-card-name">Interpretação:</p>
                                <p className="history-card-interpretation">{reading.interpretation}</p>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}
