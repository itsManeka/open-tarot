import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase";
import './styles/HamburgerMenu.css';

type HamburgerMenuProps = {
    user: any;
    isAdm: boolean;
    menuOpen: boolean;
    setMenuOpen: (value: boolean) => void;
};

export default function HamburgerMenu({ user, isAdm, menuOpen, setMenuOpen }: HamburgerMenuProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
        setMenuOpen(false);
        auth.signOut();
        navigate("/login");
    };

    return (
        <nav className={`hamburger-menu ${menuOpen ? "hamburger-menu-open" : "hamburger-menu-closed"}`}>
            {user ? (
                <>
                    <Link to="/question" onClick={() => setMenuOpen(false)}>Tiragem</Link>
                    <Link to="/dream" onClick={() => setMenuOpen(false)}>Sonhos</Link>
                    <Link to="/history" onClick={() => setMenuOpen(false)}>Histórico</Link>
                    <Link to="/profile" onClick={() => setMenuOpen(false)}>Perfil</Link>
                    {isAdm && (
                        <Link to="/infomaker" onClick={() => setMenuOpen(false)}>Publicar</Link>
                    )}
                    <Link to="/news" onClick={() => setMenuOpen(false)}>Publicações</Link>
                    <Link to="/info/como-funciona" onClick={() => setMenuOpen(false)}>Como funciona</Link>
                    <button onClick={handleLogout}>Sair</button>
                </>
            ) : (
                <>
                    <Link to="/login" onClick={() => setMenuOpen(false)}>Faça Login</Link>
                    <Link to="/news" onClick={() => setMenuOpen(false)}>Publicações</Link>
                    <Link to="/info/como-funciona" onClick={() => setMenuOpen(false)}>Como funciona</Link>
                </>
            )}
        </nav>
    );
}
