import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import './InfoPage.css';
import Loading from "../components/Loading";
import { PageContent } from "../types/types";
import { SOCIAL_BASES } from "../types/enums";
import { NiceHelmet } from "../components/NiceHelmet";
import { formatDateForDisplay } from "../utils/dateHelper";

export default function InfoPage() {
    const [user, loading] = useAuthState(auth);

    const { slug } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [content, setContent] = useState<PageContent | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            if (!slug) return null;
            setIsLoading(true);
            const ref = doc(db, "pages", slug);
            const snap = await getDoc(ref);
            if (snap.exists()) {
                setContent(snap.data() as PageContent);
            }
            setIsLoading(false);
        };
        fetchContent();
    }, [slug]);

    if (isLoading || loading) return <Loading />;

    if (!user && (content?.visibility !== "public" && content?.visibility !== "institutional")) return (
        <div className="info-page">
            <h1>Não autorizado</h1>
            <div className="info-page-section">
                <p>Desculpe, mas você não tem permissão para acessar essa página.</p>
                <p>Você pode voltar para a <Link to="/">página inicial</Link>.</p>
            </div>
        </div>
    );

    if (!content) return (
        <div className="info-page">
            <h1>Página não encontrada</h1>
            <div className="info-page-section">
                <p>Desculpe, mas a página que você está procurando não existe.</p>
                <p>Você pode voltar para a <Link to="/">página inicial</Link>.</p>
            </div>
        </div>
    );

    return (
        <div className="info-page">
            <NiceHelmet
                title={content.title}
                meta={[{name: "description", content: content.sections?.[0]?.body.slice(0, 57) + "..."}]}
            />
            <img src={content.img} alt={content.title} className="info-page-cover" />
            <h1>{content.title}</h1>

            {/* Tags */}
            {content.tags?.length > 0 && (
                <div className="info-page-tags">
                    {content.tags.map((tag, i) => (
                        <span key={i} className="info-page-tag">{tag}</span>
                    ))}
                </div>
            )}

            {/* Info autor + data */}
            <div className="info-page-meta">
                {content.author && <span>Por {content.author}</span>}
                {content.createdAt && (
                    <span>
                        {formatDateForDisplay(content.createdAt)}
                    </span>
                )}
            </div>

            {/* Seções */}
            {content.sections?.length ? content.sections.map((section, i) => (
                <div key={i} className="info-page-section">
                    <h2>{section.heading}</h2>
                    {section.body.split("\\n").map((line, j) => (
                        <p key={j}>{line}</p>
                    ))}
                </div>
            )) : <p>Sem conteúdo.</p>}

            {/* Rodapé com descrição + redes sociais */}
            {content.footer?.description && (
                <div className="info-page-footer">
                    <p>{content.footer.description}</p>
                    <div className="info-page-social-links">
                        {content.footer.socialLinks.map((link, i) => {
                            const base = SOCIAL_BASES[link.type] ?? "";
                            const fullUrl = link.url.startsWith("http")
                                ? link.url
                                : base + link.url;

                            return (
                                <a key={i} href={fullUrl} target="_blank" rel="noopener noreferrer" className={`info-page-icon ${link.type}`} aria-label={`Link para ${link.type}`}>
                                    {link.type}
                                </a>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
