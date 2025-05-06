import { useEffect, useState, useMemo } from 'react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { PageContent } from '../types/types';
import NewsCard from '../components/NewsCard';
import Loading from '../components/Loading';
import { useAuthState } from "react-firebase-hooks/auth";
import './News.css';
import { NiceHelmet } from '../components/NiceHelmet';

type PageWithId = PageContent & { id: string };

export default function News() {
    const [user] = useAuthState(auth);

    const visibilityFilter = useMemo(() => (user ? ["public", "members"] : ["public"]), [user]);

    const [isLoading, setIsLoading] = useState(false);
    const [allPages, setAllPages] = useState<PageWithId[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(6);

    useEffect(() => {
        const fetchPages = async () => {
            setIsLoading(true);

            const q = query(
                collection(db, 'pages'),
                where('visibility', 'in', visibilityFilter),
                orderBy('createdAt', 'desc')
            );

            const snapshot = await getDocs(q);
            const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PageWithId));
            setAllPages(docs);

            // Gerar lista única de tags
            const allTags = docs.flatMap(doc => doc.tags || []);
            const uniqueTags = Array.from(new Set(allTags));
            setTags(uniqueTags);

            setIsLoading(false);
        };

        fetchPages();
    }, [visibilityFilter]);

    const filteredPages = selectedTag
        ? allPages.filter(p => p.tags?.includes(selectedTag))
        : allPages;

    const visiblePages = filteredPages.slice(0, visibleCount);

    const handleTagClick = (tag: string | null) => {
        if (tag === selectedTag) {
            setSelectedTag(null);
        } else {
            setSelectedTag(tag);
            setVisibleCount(6);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isLoading) return <Loading />;

    {!visiblePages.length && (
        <p className="news-no-content-message">Nenhuma publicação encontrada.</p>
    )}

    return (
        <div className="news-container">
            <NiceHelmet
                title={"Open Tarot"}
                meta={[{name: "description", content: "Publicações"}]}
            />
            <h1 className="news-title">Publicações</h1>

            <div className="news-tag-filter">
                <button
                    className={!selectedTag ? 'news-tag active' : 'news-tag'}
                    onClick={() => handleTagClick(null)}
                >
                    Todas
                </button>
                {tags.map(tag => (
                    <button
                        key={tag}
                        aria-pressed={selectedTag === tag}
                        className={selectedTag === tag ? 'news-tag active' : 'news-tag'}
                        onClick={() => handleTagClick(tag)}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            <div className="news-grid">
                {visiblePages.map(page => (
                    <NewsCard key={page.id} page={page} />
                ))}
            </div>

            {visibleCount < filteredPages.length && (
                <div className="news-load-more">
                    <button onClick={() => setVisibleCount(v => v + 6)}>Carregar mais</button>
                </div>
            )}
        </div>
    );
}