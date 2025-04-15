import { useNavigate } from 'react-router-dom';
import { NewsCardProps } from '../types/types';
import './NewsCard.css';

export default function NewsCard({page}: NewsCardProps) {
    const navigate = useNavigate();

    return (
        <div className="page-card">
            <div className="page-img" style={{ backgroundImage: `url(${page.img})` }}></div>
            <div className="page-content">
                <h2>{page.title}</h2>
                <p className="page-snippet">{page.sections?.[0]?.body.slice(0, 120)}...</p>
                <p className="page-date">{new Date(page.createdAt).toLocaleDateString()}</p>
                <button className="page-button" onClick={() => navigate(`/info/${page.id}`)}>
                    Ler mais
                </button>
            </div>
        </div>
    );
}
