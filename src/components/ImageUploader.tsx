import { useState } from "react";
import "./ImageUploader.css";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function ImageUploader({imageLoaded}: {imageLoaded: (imageUrl: string) => void}) {
    const [imageUrl, setImageUrl] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const onFileChange = async (file: File | null) => {
        setFile(file)
    }

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", UPLOAD_PRESET);

            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            setImageUrl(data.secure_url);
            imageLoaded(data.secure_url);
        } catch (error) {
            console.error("Error uploading image:", error);
        }
        setLoading(false);
    };

    return (
        <div>
            <div className="imageuploader-container">
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onFileChange(e.target.files?.[0] || null)}
                    className="imageuploader-input"
                />
                <button
                    onClick={handleUpload}
                    disabled={!file || loading}    
                    className="imageuploader-button"
                >
                    {loading ? "Enviando..." : "Upload"}
                </button>
            </div>
            <div className="imageuploader-container">
                {imageUrl && (<p>Imagem carregada em: {imageUrl}</p>)}
            </div>
        </div>
    );
};
