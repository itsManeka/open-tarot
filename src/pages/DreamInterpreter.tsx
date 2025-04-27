import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from '../services/firebase';
import { collection, doc, getDoc, addDoc, Timestamp } from 'firebase/firestore';
import { useTokens } from '../context/TokenProvider';
import { PromptHelper } from '../utils/promptHelper';
import { sendMessageToAI } from '../services/aiEngine';
import './DreamInterpreter.css'
import AmzBanner from '../components/AmzBanner';
import Loading from '../components/Loading';

export default function DreamInterpreter() {
    const navigate = useNavigate();

    const [description, setDescription] = useState('');
    const [interpretation, setInterpretation] = useState('');

    const [user] = useAuthState(auth);
    const [isProfileExists, setIsProfileExists] = useState(false);

    const [saved, setSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<string | null>(null);
    const [snackbarStatus, setSnackbarStatus] = useState("ok");

    const { useToken, tokens, loading } = useTokens();
        
    useEffect(() => {
        if (!user) return;

        const fetchProfile = async () => {
            const profileRef = doc(db, 'profile', user.uid);
            const profileSnap = await getDoc(profileRef);

            if (profileSnap.exists()) {
                setIsProfileExists(true);
            }
        };

        fetchProfile();
    }, [user]);

    const handleInterpretation = async () => {
        if (tokens == null || tokens == undefined) {
            showSnackbar("Aguarde um momento até que suas fichas sejam carregadas.", "error");
            return;
        } else if (tokens < 1) {
            showSnackbar("Você não tem fichas suficientes.", "error");
            return;
        }

        setIsLoading(true);

        const success = await useToken();
        if (!success) {
            showSnackbar("Ocorreu um erro ao realizar a interpretação, favor recarregar a página e tentar novamente.", "error");
            setIsLoading(false);
            return;
        }

        const prompt = PromptHelper.generateDreamInterpretationPrompt(description);
        const interpretation = await sendMessageToAI(prompt);
        setInterpretation(interpretation);
        setIsLoading(false);
    };

    const handleSave = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            await addDoc(collection(db, "readings"), {
                uid: user.uid,
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
        setIsLoading(false);
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
        
    if (loading) {
        return <Loading />
    }

    return (
        <div className='dream-container'>
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
                <div className="dream-interpretations-container">
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

            <div className="dream-interpretations-container">
                <div className='dream-interpretation-ad-box'>
                    <AmzBanner
                        query='sonhos'
                    />
                </div>
            </div>

            {snackbar && <div className={`dream-snackbar ${snackbarStatus}`}>{snackbar}</div>}

            <div className="dream-button-container">
                {!interpretation ? (
                    <button
                        onClick={handleInterpretation}
                        disabled={isLoading || !description.trim()}
                        className="dream-button"
                    >
                        {isLoading ? "Interpretando..." : "Interpretar"}
                    </button>
                ) : (
                    <>
                        <button
                            onClick={saved ? handleHistory : handleSave}
                            disabled={isLoading}
                            className="dream-button"
                        >
                            {saved ? "Ir para histórico" : isLoading ? "Salvando..." : "Salvar no histórico"}
                        </button>
                        <button
                            onClick={newInterpretation}
                            disabled={isLoading}
                            className="dream-button"
                        >
                            Nova interpretação
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}