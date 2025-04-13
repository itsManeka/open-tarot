import { Link, useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../services/firebase";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import "./Layout.css";
import AdBanner from './AdBanner';

export default function Layout({ children }: { children: React.ReactNode }) {
    const [user] = useAuthState(auth);
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileName, setProfileName] = useState("");

    const isLoginPage = location.pathname === "/login";

    const handleLogout = () => {
        setMenuOpen(false);
        auth.signOut();
    };

    useEffect(() => {
        const fetchProfileName = async () => {
            if (user) {
                const profileRef = doc(db, "profile", user.uid);
                const profileSnap = await getDoc(profileRef);

                if (profileSnap.exists()) {
                    const profileData = profileSnap.data();
                    setProfileName(profileData.nome || "");
                } else {
                    // Caso não haja dados na tabela profile, usa o primeiro nome do usuário
                    const [firstName] = user.displayName?.split(" ") || ["Usuário"];
                    setProfileName(firstName);
                }
            }
        };

        fetchProfileName();
    }, [user]);

    return (
        <div className="layout-container">
            {/* Menu hambúrguer */}
            {menuOpen && (
                <nav className="hamburger-menu">
                    <Link to="/profile" onClick={() => setMenuOpen(false)}>Perfil</Link>
                    <Link to="/question" onClick={() => setMenuOpen(false)}>Tiragem</Link>
                    <Link to="/history" onClick={() => setMenuOpen(false)}>Histórico</Link>
                    <button onClick={handleLogout}>Sair</button>
                </nav>
            )}

            {/* Cabeçalho com título e menu hambúrguer */}
            {!isLoginPage && user && (
                <header className="header">
                    <div className="app-container">
                        <img className="app-icon" src="/vite.svg" />
                        <h1 className="app-title">Open Tarot</h1>
                    </div>
                    <div className="user-container">
                        <h1 className="user-name">| {profileName}</h1>
                        <button
                            className="hamburger-button"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            ☰
                        </button>
                    </div>
                </header>
            )}

            {/* Conteúdo principal */}
            <main>{children}</main>

            <div>
                {/* Anúncios apenas fora da tela de login */}
                {!isLoginPage && <AdBanner />}
            </div>
        </div>
    );
}