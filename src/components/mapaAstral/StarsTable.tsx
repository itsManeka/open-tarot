import { StringHelper } from "../../utils/stringHelper";
import { Stars, STARS_IMG } from "../../types/astrologicalChartsTypes";
import ShareableWrapper from "../ShareableWrapper";

import "./styles/StarsTable.css";

interface StarsTableProps {
    stars: Stars[];
}

const CLASSIFICATION_ORDER = [
    "Luminares",
    "Planetas Pessoais",
    "Planetas Sociais",
    "Planetas Geracionais",
    "Pontos Angulares",
    "Nodos Lunares",
    "Outros",
];

export function StarsTable({ stars }: StarsTableProps) {
    const starsClassification = CLASSIFICATION_ORDER.map((category) => ({
        category,
        itens: (stars || []).filter((a) => a.classificacao === category),
    }));

    return (
        <div className="stars-table">
            <h2 className="stars-table-title">Astros</h2>
            {starsClassification.map(({ category, itens }) =>
                itens.length > 0 && (
                    <ShareableWrapper
                        key={category}
                        title="Mapa Astral"
                        text={`Astros da categoria ${category}`}
                    >
                        <div key={category} className="stars-table-section">
                            <p className="stars-table-category-name">{category}</p>
                            {itens.map((star) => (
                                <div key={star.nome} className="stars-table-section-item-box">
                                    <div className="stars-table-section-item star" data-snapshot-img="download">
                                        <img className="stars-table-star-img" src={`/assets/astrology/${STARS_IMG[star.nome]}.svg`} />
                                        {star.nome}
                                    </div>
                                    <div className="stars-table-section-item" data-snapshot-img="download">
                                        <img className="stars-table-sign-img" src={`/assets/signos/${StringHelper.strNormalize(star.signo).toLowerCase()}.svg`} />
                                        {star.signo}
                                    </div>
                                    <div className="stars-table-section-item">
                                        {StringHelper.formatSignPosition(star.grau)}
                                    </div>
                                    <div className="stars-table-section-item icons" data-snapshot-img="download">
                                        <img className="stars-table-icon-img" src={`/assets/elements/${star.elemento}.svg`} />
                                        <img className="stars-table-icon-img" src={`/assets/modalitys/${star.modalidade}.svg`} />
                                        <img className="stars-table-icon-img" src={`/assets/polaritys/${star.polaridade}.svg`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ShareableWrapper>
                )
            )}
        </div>
    );
}