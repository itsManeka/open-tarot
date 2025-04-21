import { Link, useLocation } from "react-router-dom";
import './styles/Header.css'

type HeaderProps = {
    user: any;
    profileName: string;
    menuOpen: boolean;
    setMenuOpen: (value: boolean) => void;
};

export default function Header({ user, profileName, menuOpen, setMenuOpen }: HeaderProps) {
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";

    if (isLoginPage) return null;

    return (
        <header className="header">
            <div className="app-container">
                <img className="app-icon" src="/vite.svg" alt="App Logo" />
                <Link
                    to={user ? "/" : "/login"}
                    className="app-title"
                    onClick={() => setMenuOpen(false)}
                >
                    Open Tarot
                </Link>
            </div>
            <div className="user-container">
                <h1 className="layout-divisor">|</h1>
                <Link
                    to={user ? "/" : "/login"}
                    className="layout-home"
                    onClick={() => setMenuOpen(false)}
                >
                    {user ? "Home" : "Faça Login"}
                </Link>
                <h1 className="layout-divisor">|</h1>
                <Link
                    to={user ? "/profile" : "/login"}
                    className="user-name"
                    onClick={() => setMenuOpen(false)}
                >
                    {user ? profileName : "Visitante"}
                </Link>
                <button
                    className="hamburger-button"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    ☰
                </button>
            </div>
        </header>
    );
}
