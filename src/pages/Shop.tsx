import './Shop.css'

import { auth } from "../services/firebase"
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from 'react';
import Loading from "../components/Loading";
import { StripePrice } from "../types/types";
import { StringHelper } from "../utils/stringHelper";
import { NiceHelmet } from "../components/NiceHelmet";

export default function Shop() {
    const [user, loading] = useAuthState(auth);
    const [prices, setPrices] = useState<StripePrice[]>();
    const [isFetching, setIsFetching] = useState(false);
    const [isBuying, setIsBuying] = useState(false);
    
    useEffect(() => {
        const fetchProducts = async () => {
            setIsFetching(true);
            try {
                if (!user) {
                    setIsFetching(false);
                    return;
                }

                const res = await fetch(`${import.meta.env.VITE_TOKEN_API}/shop/products`, {
                    method: 'GET',
                });

                const data: StripePrice[] = await res.json();
                if (res.ok) {
                    setPrices(data);
                }
            } catch (e) {
                console.error('Erro ao carregar produtos da loja:', e);
            }

            setIsFetching(false);
        };
        
        fetchProducts();
    }, [user]);

    const handleBuy = async (priceId: string) => {
        if (!user) return alert('Você precisa estar logado.');

        setIsBuying(true);

        const token = await user.getIdToken();
        const res = await fetch(`${import.meta.env.VITE_TOKEN_API}/shop/checkout-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ priceId }),
        });

        const data = await res.json();

        setIsBuying(false);

        if (data.url) {
            window.location.href = data.url;
        } else {
            alert('Erro ao iniciar pagamento.');
        }
    };

    if (loading || isFetching) return <Loading />

    return (
        <div className="shop-container">
            <NiceHelmet
                title={"Open Tarot"}
                meta={[{name: "description", content: "Loja"}]}
            />
            <h2 className="shop-title">Comprar Fichas</h2>
            {prices ? (
                <div className="shop-grid">
                    {prices.map(price => (
                        <div key={price.id} className="shop-item">
                            <img
                                className='shop-item-img'
                                src={price.product.images[0]}
                            />
                            <h3 className="shop-item-title">{price.product.name}</h3>
                            <p className="shop-item-description">{price.product.description}</p>
                            <p className="shop-item-price">{StringHelper.formatPrice(price.unit_amount / 100, price.currency)}</p>
                            <button
                                onClick={() => handleBuy(price.id)}
                                disabled={isFetching || isBuying || loading}
                                className="shop-item-button"
                            >
                                {isBuying ? 'Aguarde...' : 'Comprar'}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="shop-message">Nenhum produto disponível</p>
            )}
        </div>
    );
}
