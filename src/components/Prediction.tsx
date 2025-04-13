import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";

export default function Prediction() {
    const [user] = useAuthState(auth);
    const [prediction, setPrediction] = useState('');

    useEffect(() => {
        const hoje = new Date;

        const fetchPredictions = async () => {
            if (!user) return;
            
            const predictRef = doc(db, 'daily_predictions', hoje);
            const predicSnap = await getDoc(predictRef);

            if (profileSnap.exists()) {
                const data = profileSnap.data();
                setNome(data.nome || '');
                setSobrenome(data.sobrenome || '');
                setPronomes(data.pronomes || []);
                setDataNascimento(data.dataNascimento || '');
                setHorarioNascimento(data.horarioNascimento || '');
                setLocalNascimento(data.localNascimento || '');
            } else {
                const [firstName, ...lastName] = user.displayName?.split(' ') || [];
                setNome(firstName || '');
                setSobrenome(lastName.join(' ') || '');
            }
        };
    }, [user]);

    return (
        <div className="profile-container">
            test
        </div>
    );
}