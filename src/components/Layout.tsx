import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../services/firebase";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import "./Layout.css";
import AdBanner from './AdBanner';
import { CookieBanner } from "./CookieBanner";

export default function Layout({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();

    const [isAdm, setIsAdm] = useState(false);

    const [user, loading] = useAuthState(auth);
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileName, setProfileName] = useState("");

    const isLoginPage = location.pathname === "/login";

    const handleLogout = () => {
        setMenuOpen(false);
        auth.signOut();
        navigate("/login")
    };

    useEffect(() => {
        if (loading) return;

        if (user && user.uid === import.meta.env.VITE_UUID_ADM) {
            setIsAdm(true);
        } else {
            setIsAdm(false);
        }

        const fetchProfileName = async () => {
            if (user) {
                const profileRef = doc(db, "profile", user.uid);
                const profileSnap = await getDoc(profileRef);

                if (profileSnap.exists()) {
                    const profileData = profileSnap.data();
                    setProfileName(profileData.nome || "Visitante");
                } else {
                    const [firstName] = user.displayName?.split(" ") || user.email?.split("@") || ["Visitante"];
                    setProfileName(firstName);
                }
            }
        };

        fetchProfileName();
    }, [user, loading]);

    return (
        <div className="layout-container">
            {menuOpen && user && (
                <nav className="hamburger-menu">
                    <Link to="/question" onClick={() => setMenuOpen(false)}>Tiragem</Link>
                    <Link to="/history" onClick={() => setMenuOpen(false)}>Histórico</Link>
                    <Link to="/profile" onClick={() => setMenuOpen(false)}>Perfil</Link>
                    {isAdm && (
                        <Link to="/infomaker" onClick={() => setMenuOpen(false)}>Publicar</Link>
                    )}
                    <Link to="/news" onClick={() => setMenuOpen(false)}>Publicações</Link>
                    <Link to="/info/como-funciona" onClick={() => setMenuOpen(false)}>Como funciona</Link>
                    <button onClick={handleLogout}>Sair</button>
                </nav>
            )}

            {menuOpen && !user && (
                <nav className="hamburger-menu">
                    <Link to="/login" onClick={() => setMenuOpen(false)}>Faça Login</Link>
                    <Link to="/news" onClick={() => setMenuOpen(false)}>Publicações</Link>
                    <Link to="/info/como-funciona" onClick={() => setMenuOpen(false)}>Como funciona</Link>
                </nav>
            )}

            {!isLoginPage && user && (
                <header className="header">
                    <div className="app-container">
                        <img className="app-icon" src="/vite.svg" />
                        <Link to="/" className="app-title" onClick={() => setMenuOpen(false)}>Open Tarot</Link>
                    </div>
                    <div className="user-container">
                        <h1 className="layout-divisor">|</h1>
                        <Link to="/" className="layout-home" onClick={() => setMenuOpen(false)}>Home</Link>
                        <h1 className="layout-divisor">|</h1>
                        <Link to="/profile" className="user-name" onClick={() => setMenuOpen(false)}>{profileName}</Link>
                        <button
                            className="hamburger-button"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            ☰
                        </button>
                    </div>
                </header>
            )}

            {!isLoginPage && !user && (
                <header className="header">
                    <div className="app-container">
                        <img className="app-icon" src="/vite.svg" />
                        <Link to="/login" className="app-title" onClick={() => setMenuOpen(false)}>Open Tarot</Link>
                    </div>
                    <div className="user-container">
                        <h1 className="layout-divisor">|</h1>
                        <Link to="/login" className="layout-home" onClick={() => setMenuOpen(false)}>Faça Login</Link>
                        <h1 className="layout-divisor">|</h1>
                        <Link to="/login" className="user-name" onClick={() => setMenuOpen(false)}>Visitante</Link>
                        <button
                            className="hamburger-button"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            ☰
                        </button>
                    </div>
                </header>
            )}

            <main>{children}</main>

            <div>
                {<AdBanner />}
            </div>

            <footer className="footer">
                <CookieBanner />

                <div className="footer-links">
                    <Link to="/info/sobre-nos">Sobre</Link>
                    <Link to="/info/politica-de-privacidade">Política de Privacidade</Link>
                    <Link to="/info/termos-de-uso">Termos de Uso</Link>
                    <Link to="/info/contato">Contato</Link>
                </div>
                <p className="footer-copy">© {new Date().getFullYear()} Open Tarot. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}