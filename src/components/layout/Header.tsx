import { Link, useLocation } from "react-router-dom";
import { useTokens } from "../../context/TokenProvider";
import './styles/Header.css'
import MenuButton from "./MenuButton";

type HeaderProps = {
    user: any;
    profileName: string;
    menuOpen: boolean;
    hasNotifications: boolean;
    setMenuOpen: (value: boolean) => void;
};

export default function Header({ user, profileName, menuOpen, hasNotifications, setMenuOpen }: HeaderProps) {
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";

    const { tokens } = useTokens();

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
                {user && (
                    <>
                        <div className="token-display">
                            <img src="/assets/statics/token.svg" className="header-token-icon" />
                            <span>{tokens}</span>
                        </div>
                    </>
                )}
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
                <MenuButton
                    menuOpen={menuOpen}
                    hasNotifications={hasNotifications}
                    setMenuOpen={setMenuOpen}
                />
            </div>
        </header>
    );
}
