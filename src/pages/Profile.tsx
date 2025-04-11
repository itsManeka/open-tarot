import React from "react";
import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import './Profile.css';

const apiKey = import.meta.env.VITE_MAPS_API_KEY;
const libraries: ('places')[] = ['places'];

export default function Profile() {
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [pronomes, setPronomes] = useState<string[]>([]);
    const [dataNascimento, setDataNascimento] = useState('');
    const [horarioNascimento, setHorarioNascimento] = useState('');
    const [localNascimento, setLocalNascimento] = useState('');
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({ nome: '', dataNascimento: '', horarioNascimento: '' });
    const [user] = useAuthState(auth);
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
            }
        };

        fetchProfile();
    }, [user, navigate]);

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
        console.log('pronomes', pronomes);
        console.log('p', p);
        console.log('pronome', pronome);
        setPronomes(p);
    };

    const salvarDados = async () => {
        if (!user) return;

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

        setMessage('Perfil atualizado com sucesso!');
        setIsEditing(false);

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
        return <div>Carregando...</div>;
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
                    {errors.nome && <span className="error-message">{errors.nome}</span>}
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
                    <div className="tags-container">
                        {pronomes.map((pronome, index) => (
                            <span key={index} className="tag">
                                {pronome}
                                <button
                                    type="button"
                                    className="remove-tag-button"
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
                                className="tag-input"
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
                    {errors.dataNascimento && <span className="error-message">{errors.dataNascimento}</span>}
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
                    {errors.horarioNascimento && <span className="error-message">{errors.horarioNascimento}</span>}
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
                <div className="profile-buttons">
                    {isEditing ? (
                        <button onClick={salvarDados} className="profile-button">
                            Salvar
                        </button>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="profile-button">
                            Editar
                        </button>
                    )}
                </div>
                {message && <p className="profile-message">{message}</p>}
            </div>
        </div>
    );
}