import React from 'react';
import { Stars, Houses, STARS_IMG } from '../../types/astrologicalChartsTypes';
import './styles/MandalaChart.css';

interface MandalaChartProps {
    stars: Stars[];
    houses: Houses[];
}

const SVG_SIZE = 500;
const CENTER = SVG_SIZE / 2;
const ZODIAC_RADIUS = SVG_SIZE * 0.45;
const ZODIAC_SYMBOL_RADIUS = SVG_SIZE * 0.48;
const HOUSE_CUSP_RADIUS = SVG_SIZE * 0.48;
const PLANET_RADIUS = SVG_SIZE * 0.38;
const HOUSE_LABEL_RADIUS = SVG_SIZE * 0.2;
const HOUSE_SYMBOL_RADIUS = SVG_SIZE * 0.19;
const HOUSE_LABEL_SIZE = 10;

const ZODIAC_SYMBOLS: Record<string, string> = {
    "Áries": "aries", "Touro": "touro", "Gêmeos": "gemeos", "Câncer": "cancer",
    "Leão": "leao", "Virgem": "virgem", "Libra": "libra", "Escorpião": "escorpiao",
    "Sagitário": "sagitario", "Capricórnio": "capricornio", "Aquário": "aquario", "Peixes": "peixes"
};

function getCoords(degree: number, radius: number): { x: number; y: number } {
    const angleRad = (degree - 90) * (Math.PI / 180);
    
    const x = CENTER + radius * Math.cos(angleRad);
    const y = CENTER + radius * Math.sin(angleRad);

    return { x, y };
}

export function MandalaChart({ stars, houses }: MandalaChartProps) {
    const sortedHouses = [...houses].sort((a, b) => a.casa - b.casa);

    function normalizeDegree(degree: number): number {
        return ((degree % 360) + 360) % 360;
    }

    houses.forEach(house => {
        house.grauZodiaco = normalizeDegree(Math.floor(house.grauZodiaco));
    });

    stars.forEach(star => {
        star.grauZodiaco = normalizeDegree(Math.floor(star.grauZodiaco));
    })

    const SIGNOS = Object.keys(ZODIAC_SYMBOLS);

    const house1Degree = sortedHouses.find(h => h.casa === 1)?.grauZodiaco ?? 0;
    const indexSignHouse1 = Math.floor(house1Degree / 30);

    const rotatedSigns = [...SIGNOS.slice(indexSignHouse1), ...SIGNOS.slice(0, indexSignHouse1)];

    const zodiacSegments = rotatedSigns.map((signName, i) => {
        const startDegree = house1Degree + ((i - 1) * 30);
        const midDegree = startDegree + 15;
        const { x, y } = getCoords(midDegree % 360, ZODIAC_SYMBOL_RADIUS);
        return {
            name: signName,
            symbol: ZODIAC_SYMBOLS[signName],
            x,
            y
        };
    });

    return (
        <div className="mandala-container">
            <svg width={SVG_SIZE} height={SVG_SIZE} viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} className="mandala-svg">
                <circle cx={CENTER} cy={CENTER} r={ZODIAC_RADIUS + 15} fill="none" stroke="#ccc" />
                <circle cx={CENTER} cy={CENTER} r={HOUSE_LABEL_RADIUS - 5} fill="none" stroke="#ccc" />

                <g className="zodiac-signs">
                    {zodiacSegments.map((sign) => (
                        <image
                            key={sign.name}
                            href={`/assets/signos/${sign.symbol}.svg`}
                            x={sign.x -15}
                            y={sign.y -15}
                            width={30}
                            height={30}
                        />
                    ))}
                </g>

                <g className="house-cusps">
                    {sortedHouses.map((house, index) => {
                        const { x: cuspX, y: cuspY } = getCoords(house.grauZodiaco, HOUSE_CUSP_RADIUS);

                        const nextHouse = sortedHouses[(index + 1) % 12];
                        let endDegree = nextHouse?.grauZodiaco;
                        
                        if (endDegree < house.grauZodiaco) {
                            endDegree += 360;
                        }

                        const midDegree = (typeof endDegree === 'number' && typeof house.grauZodiaco === 'number')
                            ? (house.grauZodiaco + endDegree) / 2
                            : house.grauZodiaco;

                        const { x: labelX, y: labelY } = getCoords(midDegree, HOUSE_SYMBOL_RADIUS);

                        return (
                            <React.Fragment key={`house-${house.casa}`}>
                                <line
                                    x1={CENTER}
                                    y1={CENTER}
                                    x2={cuspX}
                                    y2={cuspY}
                                    stroke="#aaa"
                                    strokeWidth="1"
                                    className="house-cusp-line"
                                />
                                
                                <svg className="house-number" width="60" height="60" xmlns="http://www.w3.org/2000/svg" x={labelX - 30} y={labelY - 30}>
                                    <circle cx={30} cy={30} r={15} fill="#bb86fc" />
                                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#121212" fontSize={HOUSE_LABEL_SIZE} >
                                        C{house.casa}
                                    </text>
                                </svg>
                            </React.Fragment>
                        );
                    })}
                </g>

                <g className="planets">
                    {stars.map((star, i) => {
                        const nearbyPlanets = stars.filter(other => 
                            Math.abs(other.grauZodiaco - star.grauZodiaco) < 10 && other.nome !== star.nome
                        );

                        const indexInGroup = nearbyPlanets
                            .concat(star)
                            .sort((a, b) => a.nome.localeCompare(b.nome))
                            .findIndex(p => p.nome === star.nome);

                        const randomJitter = Math.random() * 5;

                        const adjustedRadius = PLANET_RADIUS - indexInGroup * 24 + randomJitter;

                        const { x, y } = getCoords(star.grauZodiaco, adjustedRadius);

                        return (
                            <image
                                key={`planet-${star.nome}-${i}`}
                                href={`/assets/astrology/${STARS_IMG[star.nome]}.svg`}
                                x={x - 15}
                                y={y - 15}
                                width={30}
                                height={30}
                            />
                        );
                    })}
                </g>
            </svg>
        </div>
    );
}