import { useState } from "react";
import './styles/InfoMakerTag.css'

interface InfoMakerTagProps {
    tags: string[]
    setTags: (t: string[]) => void
}

export default function InfoMakerTag({tags, setTags} : InfoMakerTagProps) {
    const [newTag, setNewTag] = useState("");

    return (
        <div className="info-maker-tag-container">
            <label>
                Tags:
            </label>
            <div className="info-maker-tag-tag-container">
                {tags.map((tag, idx) => (
                    <span key={idx} className="info-maker-tag-tag">
                        {tag}
                        <button
                            className="info-maker-tag-button"
                            onClick={() => setTags(tags.filter((_, i) => i !== idx))}
                        >×</button>
                    </span>
                ))}
            </div>
            <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && newTag.trim()) {
                        e.preventDefault();
                        if (!tags.includes(newTag.trim())) {
                            setTags([...tags, newTag.trim()]);
                        }
                        setNewTag("");
                    }
                }}
                className="info-maker-tag-input"
                placeholder="Pressione Enter para adicionar"
            />
        </div>
    )
}