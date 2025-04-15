import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { PageWithId, PageContent } from '../types/types'
import { useAuthState } from "react-firebase-hooks/auth";
import './NewsGrid.css';

export default function NewsGrid() {
    const [user] = useAuthState(auth);

    const visibilityFilter = user ? ["public", "members"] : ["public"];

    const [newsPages, setNewsPages] = useState<PageWithId []>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNews = async () => {
            const q = query(
                collection(db, 'pages'),
                where('visibility', 'in', visibilityFilter),
                orderBy('createdAt', 'desc'),
                limit(5)
            );

            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                ...(doc.data() as PageContent),
                id: doc.id
            }));
            setNewsPages(data);
        };

        fetchNews();
    }, []);

    return (
        <div className="newsgrid-box">
            <h3>Publicações</h3>
            <div className="newsgrid-container">
                {newsPages.map((page, index) => (
                    <button
                        key={index}
                        className="newsgrid-item"
                        onClick={() => navigate(`/info/${page.id}`)}
                    >
                        <div className="newsgrid-image" style={{ backgroundImage: `url(${page.img})` }} />
                        <div className="newsgrid-title">{page.title}</div>
                    </button>
                ))}
                <button className="newsgrid-item see-more" onClick={() => navigate('/news')}>
                    <div className="newsgrid-image more-image">+</div>
                    <div className="newsgrid-title">Ver mais</div>
                </button>
            </div>
        </div>
    );
}