import InfoSectionEditor from "./InfoSectionEditor";
import { Section } from "../../types/types"
import './styles/InfoSectionManager.css'

interface InfoSectionManagerProps {
    title: string
    sections: Section[]
    newSectionHeading: string,
    newSectionBody: string,
    onNewSectionHeader: (header: string) => void
    onNewSectionBody: (body: string) => void
    onAddSection: () => void
    onCleanSection: () => void
    onChangeSection: (sections: Section[]) => void
}

export default function InfoSectionManager({ sections, title, newSectionHeading, newSectionBody, onNewSectionHeader, onNewSectionBody, onAddSection, onCleanSection, onChangeSection}: InfoSectionManagerProps) {
    return(
        <div className="info-section-manager-container">
            <InfoSectionEditor sections={sections} title={title} onChange={onChangeSection} />

            <label>
                Nova Seção:
                <input
                    type="text"
                    value={newSectionHeading}
                    onChange={(e) => onNewSectionHeader(e.target.value)}
                    className="info-section-manager-input"
                    placeholder="Título da seção"
                />
                <textarea
                    className="info-section-manager-textarea"
                    value={newSectionBody}
                    onChange={e => onNewSectionBody(e.target.value)}
                    placeholder="Corpo da seção"
                />
            </label>

            <div className="info-section-manager-button-container">
                <button onClick={onAddSection} className="info-section-manager-button">
                    Adicionar seção
                </button>

                <button
                    onClick={onCleanSection}
                    className="info-section-manager-button"
                >
                    Limpar seção atual
                </button>
            </div>
        </div>
    );
}