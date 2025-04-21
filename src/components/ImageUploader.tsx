import { useState } from "react";
import "./ImageUploader.css";

export default function ImageUploader({imageLoaded}: {imageLoaded: (imageUrl: string) => void}) {
    const [status, setStatus] = useState("");
    const [result, setResult] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [choice, setChoice] = useState("select");
    const [url, setUrl] = useState("");

    const onFileChange = async (file: File | null) => {
        setFile(file)
    }

    const handleUpload = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            if (choice == 'select') {
                if (!file) return;
                formData.append("file", file);
            }
            if (choice == 'url') {
                if (!url) return;
                formData.append("file", url);
            }
            formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

            const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            setResult(data.secure_url);
            imageLoaded(data.secure_url);
            setStatus("success");
        } catch (error) {
            setResult(`Erro ao carregar imagem: ${error}`);
            setStatus("error");
        }
        setLoading(false);
    };

    return (
        <div className="image-uploader-container">
            <div className="image-uploader-container-label">
                <select
                    className="image-uploader-input"
                    value={choice}
                    onChange={(e) => setChoice(e.target.value)}
                >
                    <option value="select">Upload de Arquivo</option>
                    <option value="url">Upload de URL</option>
                </select>
                {choice == "select" && (
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
                        className="image-uploader-input"
                    />
                )}
                {choice == "url" && (
                    <input
                        value={url}
                        placeholder="Cole a URL da imagem..."
                        onChange={(e) => setUrl(e.target.value)}
                        className="image-uploader-input"
                    />
                )}
                <button
                    onClick={handleUpload}
                    disabled={(!file && choice == "select") || (!url && choice == "url") || loading}    
                    className="image-uploader-button"
                >
                    {loading ? "Enviando..." : "Upload"}
                </button>
            </div>
            {result && <small className={`image-uploader-result ${status}`}>Imagem carregada em: {result}</small>}
        </div>
    );
};
