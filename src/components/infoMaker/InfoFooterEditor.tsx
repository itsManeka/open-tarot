import { SOCIAL_BASES } from "../../types/enums";
import { SocialLink, Footer } from "../../types/types";
import { StringHelper } from "../../utils/stringHelper";
import './styles/InfoFooterEditor.css'

interface InfoFooterEditorProps {
    footer: Footer
    social: SocialLink
    setFooter: (footer: Footer) => void
    setSocial: (social: SocialLink) => void
}

export default function InfoFooterEditor({ footer, social, setFooter, setSocial }: InfoFooterEditorProps) {
    return (
        <fieldset className="infofootereditor-fieldset">
            <legend>Rodapé do autor (opcional)</legend>

            <label>
                Descrição:
                <textarea
                    className="infofootereditor-textarea"
                    value={footer.description}
                    onChange={(e) =>
                        setFooter({ ...footer, description: e.target.value })
                    }
                    placeholder="Ex: Astróloga desde 2012. Especialista em tarot evolutivo."
                />
            </label>

            <label>Redes sociais / site:</label>

            <div className="infofootereditor-socials-list">
                {footer.socialLinks.map((item, idx) => (
                    <div key={idx} className="infofootereditor-social-item">
                        <span>
                            {item.type}:{" "}
                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                                {item.url}
                            </a>
                        </span>
                        <button
                            className="infofootereditor-remove-button"
                            type="button"
                            onClick={() => {
                                const updated = footer.socialLinks.filter((_, i) => i !== idx);
                                setFooter({ ...footer, socialLinks: updated });
                            }}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            <div className="infofootereditor-social-form">
                <select
                    className="infofootereditor-select"
                    value={social.type}
                    onChange={(e) => {
                        const selected = e.target.value;
                        setSocial({
                            type: selected,
                            url: SOCIAL_BASES[selected] || "",
                        });
                    }}
                >
                    {Object.keys(SOCIAL_BASES).map((key) => (
                        <option key={key} value={key}>
                            {key}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    className="infofootereditor-input"
                    value={social.url}
                    onChange={(e) =>
                        setSocial({ ...social, url: e.target.value })
                    }
                    placeholder="Cole ou edite o link"
                />

                <button
                    type="button"
                    className="infofootereditor-button"
                    onClick={() => {
                        if (social.url.trim() && StringHelper.isValidUrl(social.url)) {
                            setFooter({
                                ...footer,
                                socialLinks: [...footer.socialLinks, social],
                            });
                            setSocial({ type: "site", url: "" });
                        } else {
                            alert("URL inválida");
                        }
                    }}
                >
                    +
                </button>
            </div>
        </fieldset>
    )
}