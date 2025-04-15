import './Loading.css';

export default function Loading() {
    return (<div className="loading-component-content">
        <img
            src={`/assets/animations/loading.svg`}
            alt={`Carregando...`}
            className="loading-component-image"
        />
    </div>);
}