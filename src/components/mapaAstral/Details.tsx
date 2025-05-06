import { StringHelper } from "../../utils/stringHelper";
import { Atributes, Distributions, Numerology, STARS_IMG } from "../../types/astrologicalChartsTypes";
import UnifiedBar from "./UnifiedBar";

import './styles/Details.css'
import ShareableWrapper from "../ShareableWrapper";

interface DetailsProps {
    distributions: Distributions;
    atributes: Atributes;
    numerology: Numerology;
}

const ITEM_COLOR: Record<string, string> = {
    "Fogo": '#4d0000', "Água": "#11063c", "Ar": "#c28400", "Terra": "#004d13",
    "Cardinal": "#346049", "Mutável": "#346049", "Fixo": "#346049",
    "Negativa": "#242424", "Positiva": "#505053",
}

interface MappedData {
    label: string;
    value: number;
    color: string;
    icon: string;
}

const mapData = (data: Record<string, number>, type: string): MappedData[] =>
    Object.entries(data)
        .map(([key, value]) => ({
            label: key.charAt(0).toUpperCase() + key.slice(1),
            value,
            color: ITEM_COLOR[key],
            icon: `/assets/${type}/${key}.svg`,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));

export function Details({distributions, atributes, numerology} : DetailsProps) {
    const elementsData = mapData(distributions.elementos, "elements");
    const modalitysData = mapData(distributions.modalidades, "modalitys");
    const polaritysData = mapData(distributions.polaridades, "polaritys");

    const bars = [
        { title: "Elementos", data: elementsData },
        { title: "Modalidades", data: modalitysData },
        { title: "Polaridades", data: polaritysData },
    ];

    return (
        <div className="details-table">
            <h2 className="details-table-title">Detalhes</h2>
            {bars.map((bar, index) => (
                <ShareableWrapper
                    title="Mapa Astral"
                    text="Distribuições do Mapa Astral"
                >
                    <UnifiedBar key={index} title={bar.title} data={bar.data} />
                </ShareableWrapper>
            ))}
            <ShareableWrapper
                title="Mapa Astral"
                text="Atributos do Mapa Astral"
            >
                <p className="details-table-category-name">Atributos</p>
                <div className="details-table-section">
                    <div className="details-table-section-item-box" data-snapshot-img="download">
                        {atributes.regentes.map((regente, index) => (
                            <img key={index} className="details-table-star-img" src={`/assets/astrology/${STARS_IMG[regente]}.svg`} />
                        ))}
                        <div className="details-table-section-item flex">
                            {atributes.regentes.join(" • ")}
                        </div>
                        <div className="details-table-section-item">
                            Regentes
                        </div>
                    </div>
                    <div className="details-table-section-item-box"  data-snapshot-img="download">
                        <img className="details-table-star-img" src={`/assets/signos/${StringHelper.strNormalize(atributes.tonica).toLowerCase()}.svg`} />
                        <div className="details-table-section-item flex">
                            {atributes.tonica}
                        </div>
                        <div className="details-table-section-item">
                            Tônica
                        </div>
                    </div>
                </div>
            </ShareableWrapper>
            <ShareableWrapper
                title="Mapa Astral"
                text="Numerologia do Mapa Astral"
            >
                <p className="details-table-category-name">Numerologia</p>
                <div className="details-table-section">
                    <div className="details-table-section-item-box">
                        <div className="details-table-section-item-number-box">
                            <div className="details-table-section-item-numerology">
                                {numerology.caminhoDaVida.representacao}
                            </div>
                            Caminho de Vida
                        </div>
                        <div className="details-table-section-item-number-box">
                            <div className="details-table-section-item-numerology">
                                {numerology.numeroDestino}
                            </div>
                            Destino
                        </div>
                    </div>
                </div>
            </ShareableWrapper>
        </div>
    );
}