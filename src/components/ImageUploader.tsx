import { useState } from "react";
import "./ImageUploader.css";

export default function ImageUploader({imageLoaded}: {imageLoaded: (imageUrl: string) => void}) {
    const [resultUrl, setResultUrl] = useState("");
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
            setResultUrl(data.secure_url);
            imageLoaded(data.secure_url);
        } catch (error) {
            console.error("Error uploading image:", error);
        }
        setLoading(false);
    };

    return (
        <div>
            <select
                className="imageuploader-input"
                value={choice}
                onChange={(e) => setChoice(e.target.value)}
            >
                <option value="select">Upload de Arquivo</option>
                <option value="url">Upload de URL</option>
            </select>
            <div className="imageuploader-container">
                {choice == "select" && (
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
                        className="imageuploader-input"
                    />
                )}
                {choice == "url" && (
                    <input
                        value={url}
                        placeholder="Cole a URL da imagem..."
                        onChange={(e) => setUrl(e.target.value)}
                        className="imageuploader-input"
                    />
                )}
                <button
                    onClick={handleUpload}
                    disabled={(!file && choice == "select") || (!url && choice == "url") || loading}    
                    className="imageuploader-button"
                >
                    {loading ? "Enviando..." : "Upload"}
                </button>
            </div>
            <div className="imageuploader-container">
                {resultUrl && (<p>Imagem carregada em: {resultUrl}</p>)}
            </div>
        </div>
    );
};
