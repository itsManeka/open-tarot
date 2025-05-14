import "./Notifications.css";

import { useEffect, useState } from "react";
import { useTokens } from "../context/TokenProvider";
import { collection, doc, onSnapshot, orderBy, query, updateDoc, } from "firebase/firestore";
import { auth, db } from '../services/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { NiceHelmet } from "../components/NiceHelmet";

type Notification = {
    id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    createdAt?: any;
};

export default function () {
    const [user] = useAuthState(auth);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const { fetchTokens } = useTokens();

    useEffect(() => {
        if (!user) return;

        const ref = collection(db, "users", user.uid, "notifications");
        const q = query(ref, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Notification[];

            setNotifications(data);
        });

        return () => unsubscribe();
    }, [user]);

    const toggleExpand = async (notification: Notification) => {
        setExpandedId(expandedId === notification.id ? null : notification.id);

        if (!notification.read && user) {
            if (notification.type && notification.type == "token") {
                await fetchTokens();
            }

            const ref = doc(db, "users", user.uid, "notifications", notification.id);
            await updateDoc(ref, { read: true });
        }
    };

    return (
        <div className="notifications-container">
            <NiceHelmet
                title={"Open Tarot"}
                meta={[{name: "description", content: "Notificações"}]}
            />
            <h2>Notificações</h2>
            {notifications.length === 0 && (
                <p className="notifications-empty">Nenhuma nova notificação.</p>
            )}

            <ul className="notifications-list">
                {notifications.map((n) => (
                    <li
                        key={n.id}
                        className={`notification-item ${n.read ? "read" : "unread"}`}
                        onClick={() => toggleExpand(n)}
                    >
                        <div className="notification-header">
                            <span className={`notification-title ${n.read ? "read" : "unread"}`}>{n.title || "Nova notificação"}</span>
                            <span className="notification-date">
                                {n.createdAt?.toDate?.().toLocaleDateString("pt-BR", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>

                        {expandedId === n.id && (
                            <div className="notification-message">{n.message}</div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};
