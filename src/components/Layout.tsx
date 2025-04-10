import { Link, useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";
import { useState } from "react";
import "./Layout.css";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [user] = useAuthState(auth);
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const isLoginPage = location.pathname === "/login";

    const handleLogout = () => {
        auth.signOut();
    };

    return (
        <div className="layout-container">
            {/* Cabeçalho com título e menu hambúrguer */}
            {!isLoginPage && user && (
                <header className="header">
                    <h1 className="app-title">Open Tarot</h1>
                    <button
                        className="hamburger-button"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        ☰
                    </button>
                </header>
            )}

            {/* Menu hambúrguer */}
            {menuOpen && (
                <nav className="hamburger-menu">
                    <Link to="/question" onClick={() => setMenuOpen(false)}>
                        Tiragem
                    </Link>
                    <Link to="/history" onClick={() => setMenuOpen(false)}>
                        Histórico
                    </Link>
                    <button onClick={handleLogout}>Sair</button>
                </nav>
            )}

            {/* Conteúdo principal */}
            <main>{children}</main>
        </div>
    );
}