import React from "react";
import Loading from "../components/Loading";

import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { convertBrazilDateTimeToUTC, convertBrazilDateToUTC } from "../utils/dateHelper";
import { UserProfile } from "../types/types";
import { NiceHelmet } from "../components/NiceHelmet";

import './Profile.css';

const apiKey = import.meta.env.VITE_MAPS_API_KEY;
const libraries: ('places')[] = ['places'];

export default function Profile() {
    const [dadosOriginais, setDadosOriginais] = useState<UserProfile>({ dataNascimento: '', horarioNascimento: '', localNascimento: '', nome: '', sobrenome: '', pronomes: [] });
    
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [currentPronome, setCurrentPronome] = useState('');
    const [pronomes, setPronomes] = useState<string[]>([]);
    const [dataNascimento, setDataNascimento] = useState('');
    const [horarioNascimento, setHorarioNascimento] = useState('');
    const [localNascimento, setLocalNascimento] = useState('');
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    
    const [messages, setMessages] = useState<string[]>([]);
    const [errMessages, setErrMessages] = useState<string[]>([]);
    const [errors, setErrors] = useState({ nome: '', dataNascimento: '', horarioNascimento: '' });

    const [user] = useAuthState(auth);

    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const navigate = useNavigate();

    const today = new Date().toISOString().split("T")[0];

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: apiKey,
        libraries,
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        setIsLoading(true);

        const fetchProfile = async () => {
            const profileRef = doc(db, 'users', user.uid, 'profile', 'data');
            const profileSnap = await getDoc(profileRef);

            if (profileSnap.exists()) {
                const data = profileSnap.data();
                setNome(data.nome || '');
                setSobrenome(data.sobrenome || '');
                setPronomes(data.pronomes || []);
                setDataNascimento(data.dataNascimento || '');
                setHorarioNascimento(data.horarioNascimento || '');
                setLocalNascimento(data.localNascimento || '');
            } else {
                const [firstName, ...lastName] = user.displayName?.split(' ') || [];
                setNome(firstName || '');
                setSobrenome(lastName.join(' ') || '');
                setIsEditing(true);
            }
        };

        fetchProfile();

        setDadosOriginais({
            dataNascimento,
            horarioNascimento,
            localNascimento,
            nome,
            sobrenome,
            pronomes,
        });

        setIsLoading(false);
    }, [user, navigate]);

    const handleCancelar = async () => {
        setIsEditing(false)
        setDataNascimento(dadosOriginais.dataNascimento);
        setHorarioNascimento(dadosOriginais.horarioNascimento);
        setLocalNascimento(dadosOriginais.localNascimento);
        setNome(dadosOriginais.nome);
        setSobrenome(dadosOriginais.sobrenome);
        setPronomes(dadosOriginais.pronomes);
    } 

    const showMessage = async (message: string) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    
        setTimeout(() => {
            setMessages((prevMessages) => prevMessages.filter((msg) => msg !== message));
        }, 3000);
    };

    const showErrMessages = async (message: string) => {
        setErrMessages((prevMessages) => [...prevMessages, message]);
    
        setTimeout(() => {
            setErrMessages((prevMessages) => prevMessages.filter((msg) => msg !== message));
        }, 3000);
    }

    const buscarMapaAstral = async () => {
        if (!user) return;

        try {
            const geocoder = new window.google.maps.Geocoder();

            const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
                geocoder.geocode({ address: localNascimento }, (results, status) => {
                    if (status === 'OK' && results && results[0]) {
                        resolve(results);
                    } else {
                        reject(new Error(`Geocode failed: ${status}`));
                    }
                });
            });

            if (results && results[0]) {
                const location = results[0].geometry.location;
                const latitude = location.lat();
                const longitude = location.lng();

                const utDataNascimento = convertBrazilDateToUTC(dataNascimento);
                const utHorarioNascimento = convertBrazilDateTimeToUTC(dataNascimento, horarioNascimento);

                const token = await user.getIdToken();
                const res = await fetch(`${import.meta.env.VITE_ASTRO_API}/calcular`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}` },
                    body: JSON.stringify({
                        date: utDataNascimento,
                        time: utHorarioNascimento,
                        lat: latitude,
                        lng: longitude,
                        name: nome,
                    }),
                });

                const data = await res.json();
                showMessage(data.message);
            }
        } catch (err) {
            console.error('Erro ao buscar mapa astral', err);
            showErrMessages('Não foi possível calcular o mapa astral.');
        }
    };

    const validarDados = () => {
        const newErrors = { nome: '', dataNascimento: '', horarioNascimento: '' };

        if (!nome.trim()) {
            newErrors.nome = 'O nome não pode ficar em branco.';
        }

        if (dataNascimento && isNaN(Date.parse(dataNascimento))) {
            newErrors.dataNascimento = 'Data de nascimento inválida.';
        }

        if (horarioNascimento && !/^\d{2}:\d{2}$/.test(horarioNascimento)) {
            newErrors.horarioNascimento = 'Horário de nascimento inválido.';
        }

        setErrors(newErrors);

        return !Object.values(newErrors).some((error) => error !== '');
    };

    const adicionarPronome = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (currentPronome && pronomes.length < 3 && !pronomes.includes(currentPronome)) {
                setPronomes([...pronomes, currentPronome]);
                setCurrentPronome('');
            }
        }
    };

    const removerPronome = (pronome: string) => {
        const p = pronomes.filter((p) => p.trim().toLowerCase() !== pronome.trim().toLowerCase());
        setPronomes(p);
    };

    const salvarDados = async () => {
        if (!user) return;

        setIsLoading(true);

        if (!validarDados()) {
            return;
        }

        const profileRef = doc(db, 'users', user.uid, 'profile', 'data');
        await setDoc(profileRef, {
            nome,
            sobrenome,
            pronomes,
            dataNascimento,
            horarioNascimento,
            localNascimento,
        });

        if (
            dataNascimento !== dadosOriginais.dataNascimento ||
            horarioNascimento !== dadosOriginais.horarioNascimento ||
            localNascimento !== dadosOriginais.localNascimento ||
            nome !== dadosOriginais.nome
        ) {
            showMessage('O calculo do seu mapa astral logo será iniciado...');
            buscarMapaAstral();
        }

        setDadosOriginais({
            dataNascimento,
            horarioNascimento,
            localNascimento,
            nome,
            sobrenome,
            pronomes
        });

        showMessage('Perfil atualizado com sucesso!');
        setIsEditing(false);

        setIsLoading(false);
    };

    const onLoadAutocomplete = (autocompleteInstance: google.maps.places.Autocomplete) => {
        setAutocomplete(autocompleteInstance);
    };

    const onPlaceChanged = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            setLocalNascimento(place.formatted_address || '');
        }
    };

    if (!isLoaded) {
        return <Loading />
    }

    return (
        <div className="profile-container">
            <NiceHelmet
                title={"Open Tarot"}
                meta={[{name: "description", content: "Meu Perfil"}]}
            />
            <h2 className="profile-title">Meu Perfil</h2>
            <div className="profile-form">
                <label>
                    Nome:
                    <input
                        type="text"
                        value={nome}
                        maxLength={30}
                        onChange={(e) => setNome(e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, ""))}
                        disabled={!isEditing}
                        className={`profile-input ${errors.nome ? 'input-error' : ''}`}
                    />
                    {errors.nome && <span className="profile-error-message">{errors.nome}</span>}
                </label>
                <label>
                    Sobrenome:
                    <input
                        type="text"
                        value={sobrenome}
                        maxLength={40}
                        onChange={(e) => setSobrenome(e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, ""))}
                        disabled={!isEditing}
                        className="profile-input"
                    />
                </label>
                <div>
                    <label>Pronomes:</label>
                    <div className="profile-tags-container">
                        {pronomes.map((pronome, index) => (
                            <span key={index} className="profile-tag">
                                {pronome}
                                <button
                                    type="button"
                                    className="profile-remove-tag-button"
                                    disabled={!isEditing}
                                    onClick={() => removerPronome(pronome)}
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                        {isEditing && pronomes.length < 3 && (
                            <input
                                type="text"
                                value={currentPronome}
                                maxLength={10}
                                className="profile-tag-input"
                                placeholder="Digite e pressione Enter"
                                onKeyDown={adicionarPronome}
                                onChange={(e) => setCurrentPronome(e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "").toLowerCase())}
                                enterKeyHint="done"
                            />
                        )}
                    </div>
                </div>
                <label>
                    Data de Nascimento:
                    <input
                        type="date"
                        value={dataNascimento}
                        onChange={(e) => setDataNascimento(e.target.value)}
                        disabled={!isEditing}
                        className={`profile-input ${errors.dataNascimento ? 'input-error' : ''}`}
                        max={today}
                    />
                    {errors.dataNascimento && <span className="profile-error-message">{errors.dataNascimento}</span>}
                </label>
                <label>
                    Horário de Nascimento:
                    <input
                        type="time"
                        value={horarioNascimento}
                        onChange={(e) => setHorarioNascimento(e.target.value)}
                        disabled={!isEditing}
                        className={`profile-input ${errors.horarioNascimento ? 'input-error' : ''}`}
                    />
                    {errors.horarioNascimento && <span className="profile-error-message">{errors.horarioNascimento}</span>}
                </label>
                <label>
                    Local de Nascimento:
                    <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
                        <input
                            type="text"
                            value={localNascimento}
                            onChange={(e) => setLocalNascimento(e.target.value)}
                            disabled={!isEditing}
                            className="profile-input"
                            placeholder="Digite ou escolha no mapa"
                        />
                    </Autocomplete>
                </label>
            </div>
            {messages && messages.map((message, index) => (<small key={index} className="profile-message">{message}</small>))}
            {errMessages && errMessages.map((message, index) => (<small key={index} className="profile-error-message">{message}</small>))}
            <div className="profile-buttons">
                {isEditing ? (
                    <>
                        <button
                            onClick={salvarDados}
                            disabled={isLoading}
                            className="profile-button">
                            {isLoading ? "Carregando" : "Salvar"}
                        </button>
                        <button
                            onClick={handleCancelar}
                            disabled={isLoading}
                            className="profile-button">
                            {isLoading ? "Carregando" : "Cancelar"}
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        disabled={isLoading}
                        className="profile-button">
                        {isLoading ? "Carregando" : "Editar"}
                    </button>
                )}
            </div>
        </div>
    );
}