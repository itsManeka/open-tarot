import { useNavigate } from 'react-router-dom';
import './Shortcut.css';

type ShorcutProps = {
    route: string;
    title: string;
    imageSrc: string;
    imageAlt: string;
    buttonAlt: string;
    description: string;
};

export default function Shortcut({ route, title, imageSrc, imageAlt, buttonAlt, description }: ShorcutProps) {
    const navigate = useNavigate();

    const consultar = async () => {
        navigate(route);
    };

    return (
        <div className="shortcut-container">
            <div className="shortcut-content">
                <h2>{title}</h2>
                <div className="shortcut-box">
                    <img
                        src={imageSrc}
                        alt={imageAlt}
                        className="shortcut-image"
                    />
                    <div className="shortcut-subcontent">
                        {description.split("\\n").map((line, j) => (
                            <p key={j}>{line}</p>
                        ))}
                        <button
                            className="shortcut-button"
                            onClick={consultar}
                        >
                            {buttonAlt}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}