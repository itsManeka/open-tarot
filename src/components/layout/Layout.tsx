import { useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import Header from "./Header";
import HamburgerMenu from "./HamburgerMenu";
import Footer from "./Footer";
import './styles/Layout.css';

export default function Layout({ children }: { children: React.ReactNode }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, loading] = useAuthState(auth);
    const [profileName, setProfileName] = useState('');
    const [isAdm, setIsAdm] = useState(false)
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";

    useEffect(() => {
        if (loading) return;

        setIsAdm(user?.uid === import.meta.env.VITE_UUID_ADM);

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
            <HamburgerMenu
                isAdm={isAdm}
                menuOpen={menuOpen}
                user={user}
                setMenuOpen={setMenuOpen}
            />
            {!isLoginPage && (
                <Header
                    menuOpen={menuOpen}
                    setMenuOpen={setMenuOpen}
                    user={user}
                    profileName={profileName}
                />
            )}

            <main>{children}</main>

            <Footer />
        </div>
    );
}
