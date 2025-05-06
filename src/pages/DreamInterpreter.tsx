import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from '../services/firebase';
import { collection, doc, getDoc, addDoc, Timestamp } from 'firebase/firestore';
import { useTokens } from '../context/TokenProvider';
import { PromptHelper } from '../utils/promptHelper';
import { sendMessageToAI } from '../services/aiEngine';
import AmzBanner from '../components/AmzBanner';
import Loading from '../components/Loading';
import { NiceHelmet } from '../components/NiceHelmet';
import { StringHelper } from '../utils/stringHelper';
import { UserProfile } from '../types/types';
import { AstrologicalChartData } from '../types/astrologicalChartsTypes';

import './DreamInterpreter.css'

export default function DreamInterpreter() {
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);

    const [description, setDescription] = useState('');
    const [interpretation, setInterpretation] = useState('');
    const [mostFrequentWord, setMostFrequentWord] = useState('');

    const [user] = useAuthState(auth);
    const [userProfile, setUserProfile] = useState<UserProfile>();
    const [userAstrologicalChart, setUserAstrologicalChart] = useState<AstrologicalChartData>();
    const [isProfileExists, setIsProfileExists] = useState(true);
    const [isFetching, setisFetching] = useState(false);

    const [saved, setSaved] = useState(false);
    const [isInterpreting, setIsInterpreting] = useState(false);
    const [snackbar, setSnackbar] = useState<string | null>(null);
    const [snackbarStatus, setSnackbarStatus] = useState("ok");

    const { useToken, tokens, loading } = useTokens();
        
    useEffect(() => {
        if (!user) return;
        
        setisFetching(true);

        const fetchProfile = async () => {
            try {
                const profileRef = doc(db, 'users', user.uid, 'profile', 'data');
                const profileSnap = await getDoc(profileRef);

                if (profileSnap.exists()) {
                    setUserProfile(profileSnap.data() as UserProfile);
                    setIsProfileExists(true);
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

    useEffect(() => {
        if (interpretation) {
            scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [interpretation]);

    const handleInterpretation = async () => {
        if (tokens == null || tokens == undefined) {
            showSnackbar("Aguarde um momento até que suas fichas sejam carregadas.", "error");
            return;
        } else if (tokens < 1) {
            showSnackbar("Você não tem fichas suficientes.", "error");
            return;
        }

        setIsInterpreting(true);

        const success = await useToken();
        if (!success) {
            showSnackbar("Ocorreu um erro ao realizar a interpretação, favor recarregar a página e tentar novamente.", "error");
            setIsInterpreting(false);
            return;
        }

        const prompt = PromptHelper.generateDreamInterpretationPrompt(description, userProfile, userAstrologicalChart);
        const interpretation = await sendMessageToAI(prompt);
        handleFrequentWord(interpretation);
        setInterpretation(interpretation);
        setIsInterpreting(false);
    };

    const handleFrequentWord = async (texto: string) => {
        setMostFrequentWord(StringHelper.mostFrequentWord(texto));
    }

    const handleSave = async () => {
        if (!user) return;

        setIsInterpreting(true);
        try {
            await addDoc(collection(db, "users", user.uid, "readings"), {
                type: "dream",
                timestamp: Timestamp.now(),
                description,
                interpretation,
            });
            showSnackbar("Interpretação salva com sucesso!", "ok");
        } catch (error: any) {
            showSnackbar("Não foi possível salvar", "error");
        }
        setSaved(true);
        setIsInterpreting(false);
    }

    const handleHistory = async () => {
        if (!user) return;
        navigate('/history');
    }

    const newInterpretation = async () => {
        setInterpretation("");
        setDescription("");
        setSaved(false);
    }

    const showSnackbar = (message: string, status: string) => {
        setSnackbar(message);
        setSnackbarStatus(status);
        setTimeout(() => setSnackbar(null), 3000);
    };
        
    if (loading || isFetching) {
        return <Loading />
    }

    return (
        <div className='dream-container'>
            <NiceHelmet
                title={"Open Tarot"}
                meta={[{name: "description", content: "Como foi o seu sonho?"}]}
            />
            <div className="dream-header">
                <h2 className="dream-title">Como foi o seu sonho?</h2>
                <div className='dream-token-cost'>
                    <img src='/assets/statics/token.svg' className='dream-token-image'/>
                    <p>Cada interpretação custa <strong>1</strong> ficha</p>
                </div>
                {!isProfileExists && (
                    <p className="dream-info">
                        Dica: preencha o <Link to="/profile" className="dream-info-link">seu perfil</Link> para deixar a leitura mais precisa.
                    </p>
                )}
            </div>
            
            {!interpretation ? (
                <textarea
                    className="dream-textarea"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Descreva seu sonho"
                />
            ) : (
                <div className="dream-interpretations-container" ref={scrollRef}>
                    <div className="dream-interpretation-box dream-interpretation-box-question">
                        <p>{description}</p>
                    </div>
                </div>
            )}
            
            {interpretation && (
                <div className="dream-interpretations-container">
                    <div className="dream-interpretation-box">
                        <p>{interpretation}</p>
                    </div>
                </div>
            )}

            {snackbar && <div className={`dream-snackbar ${snackbarStatus}`}>{snackbar}</div>}

            <div className="dream-button-container">
                {!interpretation ? (
                    <button
                        onClick={handleInterpretation}
                        disabled={isInterpreting || !description.trim()}
                        className="dream-button"
                    >
                        {isInterpreting ? "Interpretando..." : "Interpretar"}
                    </button>
                ) : (
                    <>
                        <button
                            onClick={saved ? handleHistory : handleSave}
                            disabled={isInterpreting}
                            className="dream-button"
                        >
                            {saved ? "Ir para histórico" : isInterpreting ? "Salvando..." : "Salvar no histórico"}
                        </button>
                        <button
                            onClick={newInterpretation}
                            disabled={isInterpreting}
                            className="dream-button"
                        >
                            Nova interpretação
                        </button>
                    </>
                )}
            </div>

            <div className="dream-interpretations-container">
                <div className='dream-interpretation-ad-box'>
                    <AmzBanner
                        query={`sonhos ${mostFrequentWord}`}
                    />
                </div>
            </div>
        </div>
    )
}