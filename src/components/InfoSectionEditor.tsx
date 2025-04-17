import { useState } from "react";
import { Section } from "../types/types"
import './InfoSectionEditor.css'

interface InfoSectionEditorProps {
    title: string
    sections: Section[]
    onChange: (sections: Section[]) => void
}

export default function InfoSectionEditor({ sections, title, onChange }: InfoSectionEditorProps) {
    const [editingSection, setEditingSection] = useState<number | null>(null);
    
    const removeSection = (index: number) => {
        onChange(sections.filter((_, i) => i !== index));
    };

    const editSection = (index: number) => {
        if (editingSection === index) {
            setEditingSection(null);
        } else {
            setEditingSection(index);
        }
    }

    const moveSection = (index: number, direction: "up" | "down") => {
        const newSections = [...sections];
        const newIndex = direction === "up" ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= sections.length) return;
        [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
        onChange(newSections);
    };

    const onChangeSection = (index: number, field: "heading" | "body", value: string) => {
        const newSections = [...sections];
        newSections[index][field] = value;
        onChange(newSections);
    };

    return (
        <div>
            <label>
                Preview:
            </label>
            <h1>{title}</h1>
            {sections.map((section, i) => (
                <div key={i} className="infosectioneditor-section">
                    {(editingSection === i) ?
                        (<div>
                            <input
                                type="text"
                                value={section.heading}
                                onChange={(e) => onChangeSection(i, "heading", e.target.value)}
                                className="infosectioneditor-input"
                                placeholder="Título da seção"
                            />
                            <textarea
                                value={section.body}
                                onChange={(e) => onChangeSection(i, "body", e.target.value)}
                                className="infosectioneditor-textarea"
                                placeholder="Conteúdo"
                            />
                        </div>) :
                        (<div>
                            <h2>{section.heading}</h2>
                            {section.body.split("\\n").map((line, j) => (
                                <p key={j}>{line}</p>
                            ))}
                        </div>)
                    }
                    <div className="section-actions">
                        <button onClick={() => moveSection(i, "up")} disabled={i === 0 || editingSection != null}>↑</button>
                        <button onClick={() => moveSection(i, "down")} disabled={i === sections.length - 1 || editingSection != null}>↓</button>
                        <button onClick={() => removeSection(i)} disabled={editingSection != null}>Remover</button>
                        <button onClick={() => editSection(i)}>{(editingSection === i) ? ("Ok") : ("Editar")}</button>
                    </div>
                </div>
            ))}
        </div>
    );
}