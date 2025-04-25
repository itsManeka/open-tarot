import { useEffect, useState } from 'react';
import { useTokens } from "../context/TokenProvider";
import { formatCountdown } from '../utils/dateHelper';
import './TokenStatus.css'

export default function TokenStatus() {
    const { nextClaim, claimToken, loading } = useTokens();
    const [snackbar, setSnackbar] = useState<string | null>(null);
    const [countdown, setCountdown] = useState<string>('');
    const [progress, setProgress] = useState<number>(0);
    const [isLoading, setLoading] = useState(false);
    
    useEffect(() => {
        let interval: any;
        const updateCountdown = () => {
            if (!nextClaim) {
                setCountdown('');
                setProgress(1);
                return;
            }
            
            const now = new Date().getTime();
            const total = 24 * 60 * 60 * 1000;
            const diff = nextClaim.getTime() - now;

            if (diff <= 0) {
                setCountdown('');
                setProgress(1);
            } else {
                setCountdown(formatCountdown(diff));
                setProgress(Math.max(0, 1 - diff / total));
            }
        };

        updateCountdown();

        interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [nextClaim]);

    const handleClaim = async () => {
        setLoading(true);
        const ok = await claimToken();
        showSnackbar(ok ? 'Ficha resgatada!' : 'Ainda não disponível');
        setLoading(false);
    };

    const showSnackbar = (message: string) => {
        setSnackbar(message);
        setTimeout(() => setSnackbar(null), 3000);
    };

    return (
        <div className='token-status-container'>
            {loading ? (
                <div className="daily-card-loading-content">
                    <img
                        src={`/assets/animations/loading.svg`}
                        alt={`Carregando...`}
                        className="daily-card-loading-image"
                    />
                </div>
            ) : (
                <div className='token-status-content'>
                    <h2>Resgate diário</h2>
                    <div className='token-status-progress-container'>
                        <div
                            className='token-status-progress-bar'
                            style={{ width: `${(progress * 100).toFixed(1)}%`  }}
                        />
                    </div>
                    {countdown ? (
                        <p>
                            Nova ficha em: <strong>{countdown}</strong>
                        </p>
                    ) : (
                        <p>
                            Nova ficha disponível. Clique no botão abaixo para resgatar.
                        </p>
                    )}
                    <div className='token-button-container'>
                        <img
                            src='/assets/statics/token.svg'
                            className='token-status-img'
                        />
                        <button
                            onClick={handleClaim}
                            disabled={progress < 1 || isLoading}
                            className='token-status-button'
                        >
                            Resgatar ficha diária
                        </button>
                    </div>
                    {snackbar && <div className='token-status-snackbar'>{snackbar}</div>}
                </div>
            )}
        </div>
    );
}