import { Link } from 'react-router-dom';

import Prediction from '../components/Prediction';
import Shortcut from '../components/Shortcut';
import NewsGrid from '../components/NewsGrid';
import DailyCard from '../components/DailyCard';
import AmzBanner from '../components/AmzBanner';
import TokenStatus from '../components/TokenStatus';

import { ShortcutHelper } from '../utils/shortcutHelper';

import './Home.css';
import { NiceHelmet } from '../components/NiceHelmet';

export default function Home() {
    return (
        <div className="home-page">
            <NiceHelmet
                title={"Open Tarot"}
                meta={[{name: "description", content: "Home"}]}
            />
            <div className="home-header">
                <img src="/vite.svg" alt="Logo" className="home-site-logo" />
                <h1 className="home-site-title">Open Tarot</h1>
                <p className="home-site-description">
                    O Open Tarot é um site onde você pode realizar tiragem e interpretação de Tarot utilizando a Inteligência da Artificial. Veja como funciona: <Link to="/info/como-funciona">saiba mais</Link>.
                </p>
            </div>
            <div className="home-cards-container">
                <TokenStatus />
            </div>
            <div className="home-cards-container">
                <DailyCard />
            </div>
            <div className='home-cards-container'>
                <AmzBanner
                    query='tarot'
                />
            </div>
            <div className="home-cards-container">
                <Prediction />
            </div>
            <div className="home-cards-container">  
                <Shortcut
                    {...ShortcutHelper.getTarotShorcut()}
                />
            </div>
            <div className="home-cards-container">  
                <Shortcut
                    {...ShortcutHelper.getDreamShortcut()}
                />
            </div>
            <div className='home-cards-container'>
                <AmzBanner
                    query='astrologia'
                />
            </div>
            <div className="home-cards-container">
                <NewsGrid />
            </div>
        </div>
    );
}