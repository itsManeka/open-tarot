import { useEffect } from 'react';

declare global {
    interface Window {
        adsbygoogle: unknown[];
    }
}

export default function AdBanner() {
    useEffect(() => {
        try {
            if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
                window.adsbygoogle.push({});
            }
        } catch (e) {
            console.error('Adsense error:', e);
        }
    }, []);

    return (
        <ins
            className="adsbygoogle"
            style={{ display: 'block', textAlign: 'center' }}
            data-ad-client="ca-pub-7343621795854749"
            data-ad-slot="4973671218"
            data-ad-format="auto"
            data-full-width-responsive="true"
        />
    );
}
