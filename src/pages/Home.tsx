import { Link } from 'react-router-dom';
import Prediction from '../components/Prediction';
import TarotLink from '../components/TarotLink';
import NewsGrid from '../components/NewsGrid';
import './Home.css';
import DailyCard from '../components/DailyCard';

export default function Home() {

    return (
        <div className="home-page">
            <div className="home-header">
                <img src="/vite.svg" alt="Logo" className="home-site-logo" />
                <h1 className="home-site-title">Open Tarot</h1>
                <p className="home-site-description">
                    O Open Tarot é um site onde você pode realizar tiragem e interpretação de Tarot utilizando a Inteligência da Artificial. Veja como funciona: <Link to="/info/como-funciona">saiba mais</Link>.
                </p>
            </div>
            <div className="home-cards-container">
                <DailyCard />
            </div>
            <div className="home-cards-container">
                <Prediction />
            </div>
            <div className="home-cards-container">  
                <TarotLink />
            </div>
            <div className="home-cards-container">
                <NewsGrid />
            </div>
        </div>
    );
}