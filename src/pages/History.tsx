import { useEffect, useState } from "react";
import { db, auth } from "../services/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import "./History.css";

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
};

export default function History() {
    const [user] = useAuthState(auth);
    const [readings, setReadings] = useState<Reading[]>([]);

    useEffect(() => {
        if (!user) return;

        const fetchReadings = async () => {
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

        fetchReadings();
    }, [user]);

    return (
        <div className="history-container">
            <h2 className="history-title">Histórico de Tiragens</h2>
            {readings.length === 0 && (
                <p className="history-empty">Você ainda não salvou nenhuma tiragem.</p>
            )}
            {readings.map((reading, index) => (
                <div key={reading.id} className="reading-box">
                    <h3 className="reading-title">Tiragem {index + 1}</h3>
                    {reading.cards.map((card, idx) => (
                        <div key={idx} className="card-box">
                            <p className="card-name">Carta {idx + 1}: {card.name}</p>
                            <p className="card-interpretation">{card.interpretation}</p>
                        </div>
                    ))}
                    {reading.conclusion && (
                        <div className="card-box">
                            <p className="card-name">Conclusão:</p>
                            <p className="card-interpretation">{reading.conclusion}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
