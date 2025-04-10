import { useEffect, useState } from 'react';
import { sendMessageToGPT } from '../services/openai';
import { db, auth } from '../services/firebase';
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';

export default function Chat() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<any[]>([]);

    const sendMessage = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const userMessage = input;
        const aiResponse = await sendMessageToGPT(input);

        await addDoc(collection(db, 'messages'), {
            userId: user.uid,
            input: userMessage,
            response: aiResponse,
            createdAt: new Date()
        });

        setInput('');
    };

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
            collection(db, 'messages'),
            orderBy('createdAt')
        );

        const unsub = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs
                .filter(doc => doc.data().userId === user.uid)
                .map(doc => doc.data());
            setMessages(msgs);
        });

        return () => unsub();
    }, []);

    return (
        <div>
            <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Digite sua mensagem"
            />
            <button onClick={sendMessage}>Enviar</button>

            <div>
                {messages.map((msg, i) => (
                    <div key={i}>
                        <p><strong>Você:</strong> {msg.input}</p>
                        <p><strong>Gemini:</strong> {msg.response}</p>
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    );
}
