import { useState } from 'react';
import './CookieBanner.css';

export function CookieBanner() {
    const [accepted, setAccepted] = useState(() => {
        return localStorage.getItem('cookie-consent') === 'true';
    });

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'true');
        setAccepted(true);
    };

    if (accepted) return null;

    return (
        <div className="cookiebanner-banner">
            <div className="cookiebanner-content">
                <p>
                    Usamos cookies para melhorar sua experiência e exibir anúncios relevantes. Ao continuar navegando, você concorda com nossa{' '}
                    <a href="/info/politica-de-privacidade" className="cookiebanner-link">Política de Privacidade</a>.
                </p>
                <button onClick={handleAccept} className="cookiebanner-button">Aceitar e continuar</button>
            </div>
        </div>
    );
}
