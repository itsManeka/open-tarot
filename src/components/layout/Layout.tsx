import { useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../services/firebase";
import { doc, getDoc, collection, query, where, onSnapshot  } from "firebase/firestore";
import { useState, useEffect } from "react";
import Header from "./Header";
import HamburgerMenu from "./HamburgerMenu";
import Footer from "./Footer";

import './styles/Layout.css';
import ScrollToTopButton from "./ScrollToTopButton";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [user, loading] = useAuthState(auth);
    const location = useLocation();
    
    const [menuOpen, setMenuOpen] = useState(false);
    
    const [profileName, setProfileName] = useState('');
    const [isAdm, setIsAdm] = useState(false)

    const [hasNotifications, setHasNotifications] = useState(false);

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

        const fetchNotifications = async () => {
            if (!user) return;
    
            const notificationsRef = collection(db, "users", user.uid, "notifications");
    
            const q = query(
                notificationsRef,
                where("read", "==", false)
            );
    
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const has = snapshot.size > 0;
                setHasNotifications((prev) => prev !== has ? has : prev);
            });
    
            return () => unsubscribe();
        };

        fetchNotifications();
    }, [user, loading]);
    
    return (
        <div className="layout-container">
            <HamburgerMenu
                isAdm={isAdm}
                menuOpen={menuOpen}
                user={user}
                hasNotifications={hasNotifications}
                setMenuOpen={setMenuOpen}
            />
            {!isLoginPage && (
                <Header
                    user={user}
                    profileName={profileName}
                    menuOpen={menuOpen}
                    hasNotifications={hasNotifications}
                    setMenuOpen={setMenuOpen}
                />
            )}

            <main>{children}</main>

            <ScrollToTopButton />

            <Footer />
        </div>
    );
}
