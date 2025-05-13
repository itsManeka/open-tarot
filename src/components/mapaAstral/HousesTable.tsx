import './styles/HousesTable.css'

import { AstrologicalChartData, HOUSE_TAGS, HousesInterpretation, STARS_IMG } from '../../types/astrologicalChartsTypes';
import { mapPlanetsToHouses } from '../../utils/astroUtils';

import { StringHelper } from '../../utils/stringHelper';
import { UserProfile } from '../../types/types';

import { useTokens } from "../../context/TokenProvider"
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';

import ShareableWrapper from '../ShareableWrapper';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { PromptHelper } from '../../utils/promptHelper';
import { sendMessageToAI } from '../../services/aiEngine';
import { ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HousesTableProps {
    user?: User | null;
    map: AstrologicalChartData;
    profile?: UserProfile;
}

export function HousesTable({ user, map, profile }: HousesTableProps) {
    const navigate = useNavigate();
    const { tokens, useToken, loading } = useTokens();
    const [isLoading, setIsLoading] = useState(false);

    const [snackbar, setSnackbar] = useState<string | null>(null);
    const [snackbarStatus, setSnackbarStatus] = useState("ok");
    const [showShop, setShowShop] = useState(false);

    const [housesInterpretation, setHousesInterpretation] = useState<HousesInterpretation>()
    const [expandedHouses, setExpandedHouses] = useState<Record<number, boolean>>({});

    const stars = map.astros;
    const houses = map.casas;

    useEffect(() => {
        if (!user) return;

        const fetchInterpretations = async () => {
            setIsLoading(true);
            try {
                const mapaRef = doc(db, "users", user.uid, "interpretacao_casa", "data");
                const mapaSnap = await getDoc(mapaRef);
                if (mapaSnap.exists()) {
                    setHousesInterpretation(mapaSnap.data());
                }
            } catch (e) {
                console.error("Erro ao carregar interpretações das casas.");
            }
            setIsLoading(false);
        };

        fetchInterpretations();
    }, [user]);

    const HouseIcon = ({ number }: { number: number }) => (
        <svg className="houses-table-house-img" width="50" height="50" viewBox={`0 0 50 50`} xmlns="http://www.w3.org/2000/svg">
            <title>Casa {number}</title>
            <circle cx="25" cy="25" r="20" fill="#bb86fc" />
            <text x="50%" y="50%" textAnchor="middle" fill="#121212" fontSize="18px" fontWeight="bold" dy=".3em">
                C{number}
            </text>
        </svg>
    );

    const anglePoints = (stars || []).filter((a) => a.classificacao === "Pontos Angulares");

    const planetsByHouse = mapPlanetsToHouses(stars, houses);

    const interpretarCasa = async (casa: number) => {
        if (!user) return;

        if (tokens == null || tokens == undefined) {
            showSnackbar("Aguarde um momento até que suas fichas sejam carregadas.", "error");
            return;
        } else if (tokens < 1) {
            showSnackbar("Você não tem fichas suficientes.", "error");
            setShowShop(true);
            return;
        }

        setIsLoading(true);

        const success = await useToken();
        if (!success) {
            showSnackbar("Ocorreu um erro ao realizar a interpretação, favor recarregar a página e tentar novamente.", "error");
            setIsLoading(false);
            return;
        }

        try {
            const house = houses.find(h => h.casa === casa);
            if (!house) return;

            const planetas = mapPlanetsToHouses(stars, houses)[casa]?.map(p => p.nome) || [];

            const prompt = PromptHelper.generateHouseInterpretationPrompt(
                house.casa,
                house.signo,
                planetas,
                HOUSE_TAGS[casa],
                profile,
                map
            );
            const interpretation = await sendMessageToAI(prompt);

            const newInterpretation: HousesInterpretation = {
                ...(housesInterpretation || {}),
                [casa.toString()]: interpretation
            };

            setHousesInterpretation(newInterpretation);

            await setDoc(doc(db, "users", user.uid, "interpretacao_casa", "data"), {
                ...newInterpretation
            });
        } catch (error) {
            console.error("Erro ao interpretar casa:", error);
            showSnackbar("Erro ao interpretar esta casa. Tente novamente.", "error");
        }

        setIsLoading(false);
    };

    const toggleExpand = (casa: number) => {
        setExpandedHouses(prev => ({
            ...prev,
            [casa]: !prev[casa]
        }));
    };

    const showSnackbar = (message: string, status: string) => {
        setSnackbar(message);
        setSnackbarStatus(status);
        setTimeout(() => setSnackbar(null), 3000);
    };

    return (
        <ShareableWrapper
            title='Mapa Astral'
            text='Casas'
        >
            <div className="houses-table">
                <h2 className="houses-table-title">Casas</h2>
                <div className='houses-table-sign-section'>
                    {anglePoints.map(({ signo, nome }) => (
                        <div key={nome} className='houses-table-sign-box' data-snapshot-img="download">
                            <img
                                className="houses-table-sign-box-img"
                                src={`/assets/signos/${StringHelper.strNormalize(signo).toLowerCase()}.svg`}
                                alt={signo}
                                title={signo}
                            />
                            <div className='houses-table-sign-box-text a'>
                                {signo}<br />
                            </div>
                            <div className='houses-table-sign-box-text b'>
                                {nome}
                            </div>
                        </div>
                    ))}
                </div>
                {houses.map(({ casa, grau, signo }) => (
                    <div key={casa} className='houses-table-box'>
                        <div className='houses-table-section'>
                            <div className="houses-table-section-item-box">
                                <HouseIcon number={casa} />
                                <div className="houses-table-section-item house" data-snapshot-img="download">
                                    <img
                                        className="houses-table-sign-img"
                                        src={`/assets/signos/${StringHelper.strNormalize(signo).toLowerCase()}.svg`}
                                        alt={signo}
                                        title={signo}
                                    />
                                    {signo}
                                </div>
                                <div className="houses-table-section-item">
                                    {StringHelper.formatSignPosition(grau)}
                                </div>
                                {planetsByHouse[casa].map((star, i) => (
                                    <img
                                        key={i}
                                        className="houses-table-star-img"
                                        src={`/assets/astrology/${STARS_IMG[star.nome]}.svg`}
                                        alt={star.nome}
                                        title={star.nome}
                                    />
                                ))}
                            </div>
                        </div>
                        {HOUSE_TAGS[casa].length > 0 && (
                            <div className="houses-table-tags">
                                {HOUSE_TAGS[casa].map((tag, i) => (
                                    <span key={i} className="houses-table-tag">{tag}</span>
                                ))}
                            </div>
                        )}
                        {housesInterpretation?.[casa] ? (
                            <div
                                className={`houses-table-interpretation-container ${expandedHouses[casa] ? "expanded" : "collapsed"}`}
                                onClick={() => toggleExpand(casa)}
                                data-share-exclude="true"
                            >
                                <div className="houses-table-interpretation-box">
                                    {expandedHouses[casa] ? (
                                        <>
                                            <p>{housesInterpretation[casa]}</p>
                                        </>
                                    ) : (
                                        <>
                                            <ArrowDown />
                                            <p>interpretação</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        ): (
                            <div
                                className="houses-table-section-item button"
                                data-share-exclude="true"
                            >
                                <img
                                    src='/assets/statics/token.svg'
                                    className='houses-table-token-img'
                                />
                                <button
                                    onClick={() => interpretarCasa(casa)}
                                    disabled={loading || isLoading}
                                    className='houses-table-button'
                                >
                                    {isLoading ? "Interpretando" : loading ? "Carregando fichas" : "Interpretar"}
                                </button>
                                {showShop &&
                                    <button
                                        onClick={() => navigate("/shop")}
                                        className='houses-table-button'
                                    >
                                        Loja
                                    </button>
                                }
                                {snackbar && <div className={`houses-table-snackbar ${snackbarStatus}`}>{snackbar}</div>}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </ShareableWrapper>
    );
}