import { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import ImageUploader from "../components/ImageUploader";
import { Footer, Section, PageContent } from "../types/types";
import { SOCIAL_BASES } from "../types/enums";
import { StringHelper } from "../utils/stringHelper";
import './InfoMaker.css';

export default function InfoMaker() {
    const [urlImage, setUrlImage] = useState("");
    const [title, setTitle] = useState("");
    const [sections, setSections] = useState<Section[]>([]);
    const [editingSection, setEditingSection] = useState<number | null>(null);
    const [newSectionHeading, setNewSectionHeading] = useState("");
    const [newSectionBody, setNewSectionBody] = useState("");
    const [salvando, setSalvando] = useState(false);

    const [pageId, setPageId] = useState<string | null>(null);
    const [pagesList, setPagesList] = useState<{ id: string, title: string }[]>([]);
    const [isNewPage, setIsNewPage] = useState(true);

    const [customId, setCustomId] = useState("");
    const [customIdExists, setCustomIdExists] = useState(false);
    const [idTouched, setIdTouched] = useState(false);

    const [visibility, setVisibility] = useState<"public" | "members" | "premium">("public");
    const [authorName, setAuthorName] = useState("");

    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState("");

    const [newSocial, setNewSocial] = useState({ type: "site", url: "" });

    const [createdAt, setCreatedAt] = useState<string | null>(null);

    const [footer, setFooter] = useState<Footer>({
        description: "",
        socialLinks: [],
    });

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        const snapshot = await getDocs(collection(db, "pages"));
        const docs = snapshot.docs.map(doc => ({
            id: doc.id,
            title: doc.data().title || "(Sem título)"
        }));
        setPagesList(docs);
    };

    const imageLoaded = (imageUrl: string) => {
        setUrlImage(imageUrl);
    };

    const addSection = () => {
        setSections([...sections, {
            heading: newSectionHeading,
            body: newSectionBody,
        }]);
        setNewSectionHeading("");
        setNewSectionBody("");
    };

    const removeSection = (index: number) => {
        setSections(sections.filter((_, i) => i !== index));
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
        setSections(newSections);
    };

    const onChangeSection = (index: number, field: "heading" | "body", value: string) => {
        const newSections = [...sections];
        newSections[index][field] = value;
        setSections(newSections);
    };

    const handleSave = async () => {
        if (isNewPage) {
            if (!customId || !StringHelper.isValidId(customId)) {
                alert("ID inválido. Use apenas letras minúsculas, números e hífens.");
                return;
            }
            if (customIdExists) {
                alert("Já existe um documento com esse ID.");
                return;
            }
        }

        if (!title.trim()) {
            alert("O título não pode estar vazio.");
            return;
        }
        
        if (title.trim().length < 3 || title.length > 100) {
            alert("O título deve ter entre 3 e 100 caracteres.");
            return;
        }

        if (sections.length === 0) {
            alert("Adicione pelo menos uma seção antes de salvar.");
            return;
        }

        if (newSectionHeading.trim() || newSectionBody.trim()) {
            const proceed = confirm("Você preencheu uma nova seção que ainda não foi adicionada. Deseja salvar mesmo assim?");
            if (!proceed) return;
        }

        setSalvando(true);

        const data: PageContent & { createdAt: string } = {
            title,
            img: urlImage,
            sections,
            visibility,
            createdAt: createdAt || new Date().toISOString(),
            author: authorName || "Open Tarot",
            tags,
            footer,
        };

        try {
            if (isNewPage && customId) {
                await setDoc(doc(db, "pages", customId), data);
                setPageId(customId);
                setIsNewPage(false);
                await fetchPages();
            } else if (pageId) {
                await updateDoc(doc(db, "pages", pageId), data);
            }
            alert("Publicação salva com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar publicação.");
        }

        setSalvando(false);
    };

    const handlePageSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === "new") {
            setIsNewPage(true);
            setPageId(null);
            setCustomId("");
            setTitle("");
            setUrlImage("");
            setVisibility("public");
            setAuthorName("Open Tarot");
            setSections([]);
            setTags([]);
            setNewSectionHeading("");
            setNewSectionBody("");
            setFooter({ description: "", socialLinks: [] }); 
        } else {
            const selectedDoc = await getDoc(doc(db, "pages", value));
            if (selectedDoc.exists()) {
                const data = selectedDoc.data() as PageContent;
                setPageId(value);
                setIsNewPage(false);
                setTitle(data.title);
                setUrlImage(data.img);
                setVisibility(data.visibility || "public");
                setAuthorName(data.author || "");
                setSections(data.sections || []);
                setTags(data.tags || []);
                setFooter(data.footer || { description: "", socialLinks: [] });

                const createdAt = data.createdAt;
                setCreatedAt(createdAt);
            }
        }
    };

    const cleanNewSection = async () => {
        setNewSectionHeading("");
        setNewSectionBody("");
    }

    return (
        <div className="infomaker-page">
            <label>
                Página:
                <select onChange={handlePageSelect} value={pageId || "new"} className="infomaker-input">
                    <option value="new">Nova Página</option>
                    {pagesList.map(page => (
                        <option key={page.id} value={page.id}>{page.title}</option>
                    ))}
                </select>
            </label>

            {isNewPage && (
                <label>
                    ID do documento:
                    <input
                        type="text"
                        value={customId}
                        onChange={async (e) => {
                            const raw = e.target.value;
                            const cleaned = StringHelper.sanitizeId(raw);
                            setCustomId(cleaned);
                            setIdTouched(true);

                            if (cleaned) {
                                const docRef = doc(db, "pages", cleaned);
                                const snapshot = await getDoc(docRef);
                                setCustomIdExists(snapshot.exists());
                            } else {
                                setCustomIdExists(false);
                            }
                        }}
                        className="infomaker-input"
                        placeholder="ex: como-funciona"
                    />
                    {idTouched && (
                        <small style={{ color: !StringHelper.isValidId(customId) ? "red" : customIdExists ? "orange" : "green" }}>
                            {!StringHelper.isValidId(customId)
                                ? "ID inválido (use apenas letras minúsculas, números e hífens)"
                                : customIdExists
                                    ? "Este ID já existe. Escolha outro."
                                    : "ID válido e disponível"}
                        </small>
                    )}
                </label>
            )}

            {!isNewPage && pageId && (
                <p style={{ fontSize: "0.9em", color: "#888" }}>
                    ID: {pageId}
                </p>
            )}

            {createdAt && (
                <p style={{ fontSize: "0.9em", color: "#888" }}>
                    Criado em: {new Date(createdAt).toLocaleString()}
                </p>
            )}

            {urlImage && <img src={urlImage} alt={title} />}

            <label>
                Imagem de header:
                <ImageUploader imageLoaded={imageLoaded} />
            </label>

            <label>
                Visibilidade:
                <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as "public" | "members" | "premium")}
                    className="infomaker-input"
                >
                    <option value="public">Pública</option>
                    <option value="members">Apenas membros</option>
                    <option value="premium">Premium</option>
                </select>
            </label>

            <label>
                Título:
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="infomaker-input"
                />
            </label>

            <label>
                Nome do autor (opcional):
                <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="infomaker-input"
                    placeholder="Ex: Maria Taróloga"
                />
            </label>

            <label>
                Preview:
            </label>

            <h1>{title}</h1>

            {sections.map((section, i) => (
                <div key={i} className="section">
                    {(editingSection === i) ?
                        (<div>
                            <input
                                type="text"
                                value={section.heading}
                                onChange={(e) => onChangeSection(i, "heading", e.target.value)}
                                className="infomaker-input"
                                placeholder="Título da seção"
                            />
                            <textarea
                                value={section.body}
                                onChange={(e) => onChangeSection(i, "body", e.target.value)}
                                className="infomaker-textarea"
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

            <label>
                Nova Seção:
                <input
                    type="text"
                    value={newSectionHeading}
                    onChange={(e) => setNewSectionHeading(e.target.value)}
                    className="infomaker-input"
                    placeholder="Título"
                />
                <textarea
                    className="infomaker-textarea"
                    value={newSectionBody}
                    onChange={e => setNewSectionBody(e.target.value)}
                    placeholder="Corpo da seção"
                />
            </label>

            <button onClick={addSection} className="infomaker-button">
                Adicionar seção
            </button>

            <button
                onClick={cleanNewSection}
                className="infomaker-button"
            >
                Limpar seção atual
            </button>

            <label>
                Tags:
            </label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
                {tags.map((tag, idx) => (
                    <span key={idx} style={{ background: "#bb86fc", color: "#121212", padding: "5px 10px", borderRadius: "8px" }}>
                        {tag}
                        <button onClick={() => setTags(tags.filter((_, i) => i !== idx))} style={{ marginLeft: "5px", background: "none", border: "none", cursor: "pointer" }}>×</button>
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
                className="infomaker-input"
                placeholder="Pressione Enter para adicionar"
            />

            <fieldset className="infomaker-fieldset">
                <legend>Rodapé do autor (opcional)</legend>

                <label>
                    Descrição:
                    <textarea
                        className="infomaker-textarea"
                        value={footer.description}
                        onChange={(e) =>
                            setFooter({ ...footer, description: e.target.value })
                        }
                        placeholder="Ex: Astróloga desde 2012. Especialista em tarot evolutivo."
                    />
                </label>

                <label>Redes sociais / site:</label>

                <div className="infomaker-socials-list">
                    {footer.socialLinks.map((item, idx) => (
                        <div key={idx} className="infomaker-social-item">
                            <span>
                                {item.type}:{" "}
                                <a href={item.url} target="_blank" rel="noopener noreferrer">
                                    {item.url}
                                </a>
                            </span>
                            <button
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

                <div className="infomaker-social-form">
                    <select
                        className="infomaker-select"
                        value={newSocial.type}
                        onChange={(e) => {
                            const selected = e.target.value;
                            setNewSocial({
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
                        className="infomaker-input"
                        value={newSocial.url}
                        onChange={(e) =>
                            setNewSocial({ ...newSocial, url: e.target.value })
                        }
                        placeholder="Cole ou edite o link"
                    />

                    <button
                        type="button"
                        onClick={() => {
                            if (newSocial.url.trim() && StringHelper.isValidUrl(newSocial.url)) {
                                setFooter({
                                    ...footer,
                                    socialLinks: [...footer.socialLinks, newSocial],
                                });
                                setNewSocial({ type: "site", url: "" });
                            } else {
                                alert("URL inválida");
                            }
                        }}
                    >
                        +
                    </button>
                </div>
            </fieldset>

            <button onClick={handleSave} disabled={salvando} className="infomaker-button">
                {salvando ? "Salvando..." : "Salvar publicação"}
            </button>
        </div>
    );
}
