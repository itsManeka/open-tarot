import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

import "./styles/ScrollToTopButton.css";

export default function ScrollToTopButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setVisible(window.scrollY > 300);
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!visible) return null;

    return (
        <button className="scroll-to-top" onClick={scrollToTop}>
            <ArrowUp />
        </button>
    );
}