import { useNavigate } from 'react-router-dom';
import './Canceled.css'

export default function Canceled() {
    const navigate = useNavigate();

    return (
        <div className="cancel-container">
            <h2 className="cancel-title">Compra cancelada</h2>
            <p className="cancel-message">Parece que você não finalizou o pagamento.</p>
            <div className='cancel-button-container'>
                <button
                    onClick={() => navigate("/shop")}
                    className="cancel-button"
                >
                    Loja
                </button>
                <button
                    onClick={() => navigate("/")}
                    className="cancel-button"
                >
                    Home
                </button>
            </div>
        </div>
    );
};