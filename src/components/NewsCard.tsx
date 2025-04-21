import { useNavigate } from 'react-router-dom';
import { NewsCardProps } from '../types/types';
import './NewsCard.css';
import { formatDateForDisplay } from '../utils/dateHelper';

export default function NewsCard({page}: NewsCardProps) {
    const navigate = useNavigate();

    return (
        <div className="newscard-page-card">
            <div className="newscard-page-img" style={{ backgroundImage: `url(${page.img})` }}></div>
            <div className="newscard-page-content">
                <h2>{page.title}</h2>
                <p className="newscard-page-snippet">
                    {page.sections?.[0]?.body ? `${page.sections[0].body.slice(0, 120)}...` : 'Sem descrição disponível.'}
                </p>
                <p className="newscard-page-date">
                    {formatDateForDisplay(page.createdAt)}
                </p>
                <button
                    className="newscard-page-button"
                    onClick={() => navigate(`/info/${page.id}`)}
                    aria-label={`Ler mais sobre ${page.title}`}
                >
                    Ler mais
                </button>
            </div>
        </div>
    );
}
