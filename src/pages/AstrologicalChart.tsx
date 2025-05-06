import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { AstrologicalChartData } from "../types/astrologicalChartsTypes";

import Loading from "../components/Loading";
import { StarsTable } from "../components/mapaAstral/StarsTable";
import { HousesTable } from "../components/mapaAstral/HousesTable";

import './AstrologicalChart.css';
import { Details } from "../components/mapaAstral/Details";
import { MandalaChart } from "../components/mapaAstral/MandalaChart";
import { Link } from "react-router-dom";
import { NiceHelmet } from "../components/NiceHelmet";

export default function AstrologicalChart() {
    const [mapa, setMapa] = useState<AstrologicalChartData | null>(null);
    const [user, loading] = useAuthState(auth);
    const [isLoading, setIsLoading] = useState(true);

    const views = ["Astros", "Casas", "Detalhes", "Mandala"] as const;
    const [viewIndex, setViewIndex] = useState(0);

    const currentView = views[viewIndex];

    useEffect(() => {
        if (!user) return;

        const fetchMapa = async () => {
            setIsLoading(true);
            try {
                const mapaRef = doc(db, "users", user.uid, "mapa_astral", "data");
                const mapaSnap = await getDoc(mapaRef);
                if (mapaSnap.exists()) {
                    setMapa(mapaSnap.data().mapa as AstrologicalChartData);
                }
            } catch (e) {
                console.error("Erro ao carregar mapa astral.");
            }
            setIsLoading(false);
        };

        fetchMapa();
    }, [user]);

    const handlers = useSwipeable({
        onSwipedLeft: () => setViewIndex((i) => Math.min(i + 1, views.length - 1)),
        onSwipedRight: () => setViewIndex((i) => Math.max(i - 1, 0)),
        preventScrollOnSwipe: true,
        trackMouse: true,
    });

    if (isLoading || loading) return (<Loading />);
    
    if (!mapa) return (
        <p className="astrological-chart-info">
            Preencha o <Link to="/profile" className="astrological-chart-info-link">seu perfil</Link> com data, horário e local de nascimento para que seu mapa astral seja calculado.
        </p>
    );

    return (
        <div className="astrological-chart-container" {...handlers}>
            <NiceHelmet
                title={"Open Tarot"}
                meta={[{name: "description", content: "Mapa astral"}]}
            />
            <div className="astrological-chart-tab-buttons">
                {views.map((view, idx) => (
                    <button
                        key={view}
                        className={viewIndex === idx ? "active" : ""}
                        onClick={() => setViewIndex(idx)}
                    >
                        {view[0].toUpperCase() + view.slice(1)}
                    </button>
                ))}
            </div>

            {currentView === "Astros" && (
                <StarsTable
                    stars={mapa.astros}
                />
            )}
            {currentView === "Casas" && (
                <HousesTable
                    houses={mapa.casas}
                    stars={mapa.astros}
                />
            )}
            {currentView === "Detalhes" && (
                <Details
                    atributes={mapa.atributos}
                    numerology={mapa.numerologia}
                    distributions={mapa.distribuicao}
                />
            )}
            {currentView === "Mandala" && (
                <MandalaChart
                    stars={mapa.astros}
                    houses={mapa.casas}
                />
            )}
        </div>
    );
}