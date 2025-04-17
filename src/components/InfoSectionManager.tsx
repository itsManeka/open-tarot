import InfoSectionEditor from "./InfoSectionEditor";
import { Section } from "../types/types"
import './InfoSectionManager.css'

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
        <div>
            <InfoSectionEditor sections={sections} title={title} onChange={onChangeSection} />

            <label>
                Nova Seção:
                <input
                    type="text"
                    value={newSectionHeading}
                    onChange={(e) => onNewSectionHeader(e.target.value)}
                    className="infosectionmanager-input"
                    placeholder="Título"
                />
                <textarea
                    className="infosectionmanager-textarea"
                    value={newSectionBody}
                    onChange={e => onNewSectionBody(e.target.value)}
                    placeholder="Corpo da seção"
                />
            </label>

            <button onClick={onAddSection} className="infosectionmanager-button">
                Adicionar seção
            </button>

            <button
                onClick={onCleanSection}
                className="infosectionmanager-button"
            >
                Limpar seção atual
            </button>
        </div>
    );
}