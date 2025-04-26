import { useEffect, useState, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useCarouselScroll } from "../hooks/useCarouselScroll";
import { StringHelper } from "../utils/stringHelper";
import './AmzBanner.css';

type Product = {
    asin: string;
    url: string;
    title: string;
    image: string;
    price: string;
    basis: string;
};

export default function AmzBanner({ query }: { query: string }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const carouselRef = useRef<HTMLDivElement>(null);
    const scrollInterval = useRef<NodeJS.Timeout | null>(null);

    useCarouselScroll(carouselRef);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const docRef = doc(db, "amazonAds", query);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const now = Date.now();
                    const updated = data.updatedAt?.toDate()?.getTime() || 0;
                    const expired = now - updated > 24 * 60 * 60 * 1000;

                    if (!expired) {
                        setProducts(data.products);
                        return;
                    }
                }

                const res = await fetch(`${import.meta.env.VITE_AMZ_ADS_API}/search?query=${query}&itemCount=10`);
                const data = await res.json();

                setProducts(data);

            } catch (e) {
                console.error('error:', e);
                setError('error:' + e);
            } finally {
                setLoading(false);
            }
        };

        fetchAds();
    }, [query]);

    const startScrolling = (distance: number) => {
        scrollInterval.current = setInterval(() => {
            carouselRef.current?.scrollBy({ left: distance, behavior: "smooth" });
        }, 100); // Ajuste o intervalo para controlar a velocidade
    };

    const stopScrolling = () => {
        if (scrollInterval.current) {
            clearInterval(scrollInterval.current);
            scrollInterval.current = null;
        }
    };

    if (loading || error || !products.length) return (<></>);

    return (
        <div className="ad-container">
            <div className="ad-header">
                <button
                    className="amz-scroll-btn"
                    onMouseDown={() => startScrolling(-10)} // Scroll para a esquerda
                    onMouseUp={stopScrolling}
                    onMouseLeave={stopScrolling} // Garante que o scroll pare ao sair do botão
                >
                    &#x25C0;
                </button>
                <p className="ad-label">Publicidade</p>
                <button
                    className="amz-scroll-btn"
                    onMouseDown={() => startScrolling(10)} // Scroll para a direita
                    onMouseUp={stopScrolling}
                    onMouseLeave={stopScrolling} // Garante que o scroll pare ao sair do botão
                >
                    &#x25B6;
                </button>
            </div>
            <div className="amazon-carousel-wrapper" ref={carouselRef}>
                <div className="amazon-carousel">
                    {products.map((item, index) => (
                        <a
                            key={index}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="amazon-carousel-item"
                        >
                            <img src={item.image} alt={item.title} className="amz-img" />
                            <div className="amazon-info">
                                <h4>{item.title}</h4>
                                <div className="item-price">
                                    <span className="basis">{StringHelper.formatPrice(item.basis)}</span>
                                    <strong className="price">{StringHelper.formatPrice(item.price)}</strong>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}