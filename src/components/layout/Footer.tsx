import { Link } from "react-router-dom";
import { CookieBanner } from "./CookieBanner";
import AdBanner from "../AdBanner";
import './styles/Footer.css'

export default function Footer() {
    return (
        <footer className="footer">
            <AdBanner />

            <CookieBanner />

            <div className="footer-links">
                <Link to="/info/sobre-nos">Sobre</Link>
                <Link to="/info/politica-de-privacidade">Política de Privacidade</Link>
                <Link to="/info/termos-de-uso">Termos de Uso</Link>
                <Link to="/info/contato">Contato</Link>
            </div>

            <p className="footer-copy">
                © {new Date().getFullYear()} Open Tarot. Todos os direitos reservados.
            </p>
        </footer>
    );
}
