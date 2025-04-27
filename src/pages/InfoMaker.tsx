import { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import ImageUploader from "../components/ImageUploader";
import { ImageOption, SocialLink, Footer, Section, PageContent } from "../types/types";
import { StringHelper } from "../utils/stringHelper";
import './InfoMaker.css';
import InfoSectionManager from "../components/infoMaker/InfoSectionManager";
import InfoFooterEditor from "../components/infoMaker/InfoFooterEditor"
import InfoMakerLabelInput from "../components/infoMaker/InfoMakerLabelInput";
import InfoMakerTag from "../components/infoMaker/InfoMakerTag";
import InfoComponentSelector from '../components/infoMaker/InfoComponentSelector';
import { formatDateForDisplay } from "../utils/dateHelper";

export default function InfoMaker() {
    const [imageOptions, setImageOptions] = useState<ImageOption[]>([]);
    const [imageChoice, setImageChoice] = useState("existing");
    const [urlImage, setUrlImage] = useState("");

    const onChangeImageChoice = (choice: string) => {
        setImageChoice(choice);
        if (choice !== "new") {
            setUrlImage(choice)
        } else {
            setUrlImage("")
        }
    }

    const [title, setTitle] = useState("");
    const [sections, setSections] = useState<Section[]>([]);
    const [newSectionHeading, setNewSectionHeading] = useState("");
    const [newSectionBody, setNewSectionBody] = useState("");
    const [salvando, setSalvando] = useState(false);

    const [pageId, setPageId] = useState<string | null>(null);
    const [pagesList, setPagesList] = useState<{ id: string, title: string }[]>([]);
    const [isNewPage, setIsNewPage] = useState(true);

    const [customId, setCustomId] = useState("");
    const [customIdExists, setCustomIdExists] = useState(false);
    const [idTouched, setIdTouched] = useState(false);

    const [visibility, setVisibility] = useState<"public" | "members" | "premium" | "institutional">("public");
    const [authorName, setAuthorName] = useState("");

    const [tags, setTags] = useState<string[]>([]);

    const [components, setComponents] = useState<string[]>([]);

    const [newSocial, setNewSocial] = useState<SocialLink>({
        type: "site",
        url: ""
    });

    const [createdAt, setCreatedAt] = useState<string | null>(null);

    const [footer, setFooter] = useState<Footer>({
        description: "",
        socialLinks: [],
    });

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        setCreatedAt(new Date().toISOString());

        const snapshot = await getDocs(collection(db, "pages"));
        const docs = snapshot.docs.map(doc => ({
            id: doc.id,
            title: doc.data().title || "(Sem título)"
        }));
        setPagesList(docs);

        const options = snapshot.docs.map(doc => ({
            label: doc.id,
            url: doc.data().img
        }));
        setImageOptions(options);
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
            components
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
            setComponents([]);
            setCreatedAt(new Date().toISOString())
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
                setComponents(data.components || []);

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
                <InfoMakerLabelInput
                    label="ID do documento:"
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
                    placeholder="ex: como-funciona"
                    validation={!StringHelper.isValidId(customId) ? "error" : customIdExists ? "alert" : "success"}
                    message={idTouched
                        ? !StringHelper.isValidId(customId)
                            ? "ID inválido (use apenas letras minúsculas, números e hífens)"
                            : customIdExists
                                ? "Este ID já existe. Escolha outro."
                                : "ID válido e disponível"
                        : null}
                />
            )}

            {pageId && (<p>ID: {pageId}</p>)}
            {createdAt && (<p>Criado em: {formatDateForDisplay(createdAt)}</p>)}

            {urlImage && <img src={urlImage} alt={title} />}

            <label className="infomaker-label">
                Imagem de header:
                <select
                    className="infomaker-input"
                    value={imageChoice}
                    onChange={(e) => onChangeImageChoice(e.target.value)}
                >
                    <option value="existing" disabled>Escolha uma imagem existente ou faça upload</option>
                    {imageOptions.map((img, idx) => (
                        <option key={idx} value={img.url}>{img.label}</option>
                    ))}
                    <option value="new">Nova imagem (upload)</option>
                </select>

                {imageChoice === "new" && (
                    <ImageUploader imageLoaded={imageLoaded} />
                )}
            </label>

            <label>
                Visibilidade:
                <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as "public" | "members" | "premium" | "institutional")}
                    className="infomaker-input"
                >
                    <option value="public">Pública</option>
                    <option value="members">Apenas membros</option>
                    <option value="premium">Premium</option>
                    <option value="institutional">Institucional</option>
                </select>
            </label>

            <InfoMakerLabelInput label="Título:" value={title} placeholder="Ex: A história do Tarot" onChange={async (e) => setTitle(e.target.value)} />
            <InfoMakerLabelInput label="Nome do autor (opcional):" value={authorName} placeholder="Ex: Márcia Sensitiva" onChange={async (e) => setAuthorName(e.target.value)} />

            <InfoSectionManager
                sections={sections}
                title={title}
                newSectionHeading={newSectionHeading}
                newSectionBody={newSectionBody}
                onAddSection={addSection}
                onCleanSection={cleanNewSection}
                onNewSectionBody={setNewSectionBody}
                onNewSectionHeader={setNewSectionHeading}
                onChangeSection={setSections}
            />

            <InfoComponentSelector
                components={components}
                setComponents={setComponents}
            />

            <InfoMakerTag
                tags={tags}
                setTags={setTags}
            />

            <InfoFooterEditor
                footer={footer}
                social={newSocial}
                setFooter={setFooter}
                setSocial={setNewSocial}
            />

            <button onClick={handleSave} disabled={salvando} className="infomaker-button">
                {salvando ? "Salvando..." : "Salvar publicação"}
            </button>
        </div>
    );
}
