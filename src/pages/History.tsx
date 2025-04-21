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

type Reading = {
    id: string;
    timestamp: any;
    cards: SavedCard[];
    conclusion: string;
    question?: string;
};

export default function History() {
    const [user] = useAuthState(auth);
    const [readings, setReadings] = useState<Reading[]>([]);
    const [search, setSearch] = useState("");

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

    const filteredReadings = readings.filter((reading) =>
        reading.cards.some((card) =>
            card.name.toLowerCase().includes(search.toLowerCase())
        ) || reading.question?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="history-container">
            <h2 className="history-title">Histórico de Tiragens</h2>

            <input
                type="text"
                placeholder="Filtrar por carta ou pergunta..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="history-filter"
            />

            {filteredReadings.length === 0 && (
                <p className="history-empty">Nenhuma tiragem encontrada.</p>
            )}

            {filteredReadings.map((reading) => (
                <div key={reading.id} className="history-reading-box">
                    <div className="history-reading-header">
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
                </div>
            ))}
        </div>
    );
}
