import { Menu, X } from "lucide-react";
import "./styles/MenuButton.css";

type MenuButtonProps = {
    menuOpen: boolean;
    hasNotifications: boolean;
    setMenuOpen: (value: boolean) => void;
};

export default function MenuButton({menuOpen, hasNotifications, setMenuOpen }: MenuButtonProps) {
    return (
        <div className="menu-button-container">
            <button
                className="hamburger-button"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? <X /> : <Menu />}
                {hasNotifications && (
                    <span className="notification-badge" />
                )}
            </button>
        </div>
    );
};
