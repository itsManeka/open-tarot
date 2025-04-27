import { useState } from "react";
import "./styles/InfoComponentSelector.css";

const AVAILABLE_COMPONENTS = [
    { value: "contato", label: "Formulário de Contato" },
];

interface InfoComponentSelectorProps {
    components: string[];
    setComponents: (components: string[]) => void;
}

export default function InfoComponentSelector({ components, setComponents }: InfoComponentSelectorProps) {
    const [selectedComponent, setSelectedComponent] = useState("");

    const availableOptions = AVAILABLE_COMPONENTS.filter(
        (comp) => !components.includes(comp.value)
    );

    const handleAdd = () => {
        if (selectedComponent && !components.includes(selectedComponent)) {
            setComponents([...components, selectedComponent]);
            setSelectedComponent("");
        }
    };

    const handleRemove = (comp: string) => {
        setComponents(components.filter((c) => c !== comp));
    };

    return (
        <div className="info-component-selector-container">
            <label>
                Adicionar Componente:
                <div className="info-component-selector-controls">
                    <select
                        className="info-component-selector-input"
                        value={selectedComponent}
                        onChange={(e) => setSelectedComponent(e.target.value)}
                    >
                        <option value="">Selecione...</option>
                        {availableOptions.map((comp) => (
                            <option key={comp.value} value={comp.value}>
                                {comp.label}
                            </option>
                        ))}
                    </select>
                    <button
                        className="info-component-selector-button"
                        onClick={handleAdd}
                        disabled={!selectedComponent}
                    >
                        Adicionar
                    </button>
                </div>
            </label>

            {components.length > 0 && (
                <div className="info-component-selector-list">
                    <h4>Componentes adicionados:</h4>
                    <ul>
                        {components.map((comp) => {
                            const label = AVAILABLE_COMPONENTS.find(c => c.value === comp)?.label || comp;
                            return (
                                <li key={comp}>
                                    {label}
                                    <button
                                        className="info-component-selector-button remove"
                                        onClick={() => handleRemove(comp)}
                                    >
                                        Remover
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
