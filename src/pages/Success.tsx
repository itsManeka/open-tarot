import './Success.css';

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { auth } from "../services/firebase"

import Loading from '../components/Loading';

import { StringHelper } from '../utils/stringHelper';
import { StripeSession } from '../types/types';
import { useTokens } from "../context/TokenProvider";

export default function Success() {
    const [user] = useAuthState(auth);
    const { fetchTokens } = useTokens();

    const [searchParams] = useSearchParams();

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [details, setDetails] = useState<StripeSession>();

    const navigate = useNavigate();

    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        if (!user || !sessionId) return;

        const fetchSession = async () => {
            try {
                const token = await user.getIdToken();

                const res = await fetch(`${import.meta.env.VITE_TOKEN_API}/shop/verify-session?session_id=${sessionId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (res.ok) {
                    await fetchTokens();

                    setStatus('success');
                    setDetails(data);
                } else {
                    console.error(data.error);
                    setStatus('error');
                }
            } catch (err) {
                console.error(err);
                setStatus('error');
            }
        };

        fetchSession();
    }, [user, searchParams]);

    if (status === 'loading') return <Loading />

    return (
        <div className="success-container">
            <h2 className="success-title">{
                status === "error" ?
                    "Houve um erro ao verificar seu pagamento." :
                    "Pagamento confirmado!"
            }</h2>
            
            {status === "success" && details && (
                <div className="success-item">
                    <img
                        className='success-item-img'
                        src={details.product.images[0]}
                    />
                    <h3 className="success-item-title">{details.product.name}</h3>
                    <p className="success-item-description">{details.product.description}</p>
                    <p className="success-item-price">{StringHelper.formatPrice(details.amountTotal / 100, details.currency)}</p>
                </div>
            )}

            <button
                onClick={() => navigate("/")}
                className="success-button"
            >
                Home
            </button>
        </div>
    );
}
