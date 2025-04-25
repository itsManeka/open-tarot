import React from "react";
import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import './Profile.css';
import { StringHelper } from '../utils/stringHelper';
import Loading from "../components/Loading";
import { convertBrazilDateTimeToUTC, convertBrazilDateToUTC } from "../utils/dateHelper";

const apiKey = import.meta.env.VITE_MAPS_API_KEY;
const libraries: ('places')[] = ['places'];

export default function Profile() {
    const [mapaAstral, setMapaAstral] = useState<any | null>(null);
    const [dadosOriginais, setDadosOriginais] = useState({ dataNascimento: '', horarioNascimento: '', localNascimento: '' });
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [pronomes, setPronomes] = useState<string[]>([]);
    const [dataNascimento, setDataNascimento] = useState('');
    const [horarioNascimento, setHorarioNascimento] = useState('');
    const [localNascimento, setLocalNascimento] = useState('');
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [errMessage, setErrMessage] = useState('');
    const [errors, setErrors] = useState({ nome: '', dataNascimento: '', horarioNascimento: '' });
    const [user] = useAuthState(auth);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

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
            const profileRef = doc(db, 'profile', user.uid);
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
            localNascimento
        });

        const carregarMapaAstral = async () => {
            const mapaRef = doc(db, 'mapas_astro', user.uid);
            const mapaSnap = await getDoc(mapaRef);

            if (mapaSnap.exists()) {
                setMapaAstral(mapaSnap.data());
            }
        };

        carregarMapaAstral();

        setIsLoading(false);
    }, [user, navigate]);

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

                const res = await fetch(`${import.meta.env.VITE_ASTRO_API}/mapa-astral`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        date: utDataNascimento,
                        time: utHorarioNascimento,
                        lat: latitude,
                        lng: longitude
                    }),
                });

                const data = await res.json();

                return data;
            }

            return null;
        } catch (err) {
            console.error('Erro ao buscar mapa astral', err);
            setErrMessage('Não foi possível calcular o mapa astral.');
            return null;
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
            const novoPronome = e.currentTarget.value.trim().toLowerCase();

            if (novoPronome && pronomes.length < 3 && !pronomes.includes(novoPronome)) {
                setPronomes([...pronomes, novoPronome]);
                e.currentTarget.value = '';
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

        const profileRef = doc(db, 'profile', user.uid);
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
            localNascimento !== dadosOriginais.localNascimento
        ) {
            setMessage('Calculando mapa astral (Pode demorar alguns segundos)...');

            const novoMapa = await buscarMapaAstral();
            if (novoMapa) {
                const mapaRef = doc(db, 'mapas_astro', user.uid);
                await setDoc(mapaRef, novoMapa);
                setMapaAstral(novoMapa);
            }
        }

        setDadosOriginais({
            dataNascimento,
            horarioNascimento,
            localNascimento
        });

        setMessage('Perfil atualizado com sucesso!');
        setIsEditing(false);

        setIsLoading(false);

        setTimeout(() => setMessage(''), 3000);
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
            <h2 className="profile-title">Meu Perfil</h2>
            <div className="profile-form">
                <label>
                    Nome:
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
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
                        onChange={(e) => setSobrenome(e.target.value)}
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
                                className="profile-tag-input"
                                placeholder="Digite e pressione Enter"
                                onKeyDown={adicionarPronome}
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
            {mapaAstral && (
                <div className="profile-mapa-astral-signos">
                    {mapaAstral?.signos && (
                        <>
                            <div className="profile-mapa-astral-item">
                                <p className="profile-mapa-astral-posicao">Sol</p>
                                <img
                                    src={`/assets/signos/${StringHelper.strNormalize(mapaAstral.signos.solar).toLowerCase()}.svg`}
                                    alt={`Signo Solar: ${mapaAstral.signos.solar}`}
                                    className="profile-mapa-astral-image"
                                />
                                <p className="profile-mapa-astral-nome">{mapaAstral.signos.solar}</p>
                            </div>
                            <div className="profile-mapa-astral-item">
                                <p className="profile-mapa-astral-posicao">Lua</p>
                                <img
                                    src={`/assets/signos/${StringHelper.strNormalize(mapaAstral.signos.lunar).toLowerCase()}.svg`}
                                    alt={`Signo Lunar: ${mapaAstral.signos.lunar}`}
                                    className="profile-mapa-astral-image"
                                />
                                <p className="profile-mapa-astral-nome">{mapaAstral.signos.lunar}</p>
                            </div>
                            <div className="profile-mapa-astral-item">
                                <p className="profile-mapa-astral-posicao">Asc</p>
                                <img
                                    src={`/assets/signos/${StringHelper.strNormalize(mapaAstral.signos.ascendente).toLowerCase()}.svg`}
                                    alt={`Ascendente: ${mapaAstral.signos.ascendente}`}
                                    className="profile-mapa-astral-image"
                                />
                                <p className="profile-mapa-astral-nome">{mapaAstral.signos.ascendente}</p>
                            </div>
                            <div className="profile-mapa-astral-item">
                                <p className="profile-mapa-astral-posicao">MdC</p>
                                <img
                                    src={`/assets/signos/${StringHelper.strNormalize(mapaAstral.signos.meioDoCeu).toLowerCase()}.svg`}
                                    alt={`Meio do Céu: ${mapaAstral.signos.meioDoCeu}`}
                                    className="profile-mapa-astral-image"
                                />
                                <p className="profile-mapa-astral-nome">{mapaAstral.signos.meioDoCeu}</p>
                            </div>
                        </>
                    )}
                </div>
            )}
            {errMessage && <p className="profile-error-message">{errMessage}</p>}
            {message && <p className="profile-message">{message}</p>}
            <div className="profile-buttons">
                {isEditing ? (
                    <button
                        onClick={salvarDados}
                        disabled={isLoading}
                        className="profile-button">
                        {isLoading ? "Carregando" : "Salvar"}
                    </button>
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