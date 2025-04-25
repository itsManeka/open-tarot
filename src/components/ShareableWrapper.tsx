import React, { /*useEffect,*/ useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import './ShareableWrapper.css';

interface ShareableWrapperProps {
    children: React.ReactNode;
    title?: string;
    text?: string;
    siteName?: string;
    showButtons?: boolean
}

const ShareableWrapper: React.FC<ShareableWrapperProps> = ({
    children,
    siteName = 'opentarot.net',
    showButtons = true
}) => {
    const hiddenRef = useRef<HTMLDivElement>(null);

    const [imageBlob, setImageBlob] = useState<Blob | null>(null);
    const [dataUrl, setDataUrl] = useState<string | null>(null);

    /*const [filteredChildren, setFilteredChildren] = useState<React.ReactNode>(null);

    useEffect(() => {
        // Filtra os elementos que possuem a classe "shareable"
        const shareableChildren = React.Children.toArray(children).filter((child) => {
            if (React.isValidElement(child)) {
                return React.isValidElement(child) && (child as React.ReactElement<any>).props?.className?.includes('shareable');
            }
            return false;
        });

        setFilteredChildren(shareableChildren);
    }, [children]);*/

    const generateImage = async () => {
        if (!hiddenRef.current) return;

        const canvas = await html2canvas(hiddenRef.current, {
            backgroundColor: null,
            useCORS: true,
            scale: 2,
        });

        const targetWidth = 1080;
        const targetHeight = 1920;
        const resizedCanvas = document.createElement('canvas');
        resizedCanvas.width = targetWidth;
        resizedCanvas.height = targetHeight;

        const ctx = resizedCanvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#1e1e1e';
            ctx.fillRect(0, 0, targetWidth, targetHeight);
            const scale = Math.min(targetWidth / canvas.width, targetHeight / canvas.height);
            const x = (targetWidth - canvas.width * scale) / 2;
            const y = (targetHeight - canvas.height * scale) / 2;
            ctx.drawImage(canvas, x, y, canvas.width * scale, canvas.height * scale);
        }

        const url = resizedCanvas.toDataURL('image/png');
        const blob = await (await fetch(url)).blob();
        
        setDataUrl(url);
        setImageBlob(blob);

        return { url, blob };
    };

    const handleDownload = async () => {
        try {
            const image = dataUrl ? { url: dataUrl } : await generateImage();
            if (!image?.url) {
                alert("Erro ao gerar imagem.");
                return;
            }

            const link = document.createElement('a');
            link.href = image.url;
            link.download = `compartilhamento-${Date.now()}.png`;
            link.click();
        } catch (err) {
            console.error("Erro ao gerar imagem:", err);
            alert("Erro ao gerar imagem. Verifique sua conexão ou tente novamente.");
        }
    };

    const handleNativeShare = async () => {
        const image = imageBlob ? { blob: imageBlob } : await generateImage();
        if (!image?.blob) {
            alert("Erro ao gerar imagem.");
            return;
        }

        const file = new File([imageBlob!], 'compartilhamento.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: 'Minha carta do dia',
                    text: 'Veja a carta que tirei no tarot!',
                });
            } catch (err) {
                console.error('Erro ao compartilhar:', err);
            }
        } else {
            alert('Seu dispositivo não suporta compartilhamento de imagem.');
        }
    };

    const canShare = typeof navigator !== 'undefined' &&
        navigator.canShare &&
        navigator.canShare({ files: [new File([], '')] });

    return (
        <div>
            {/* Conteúdo visível */}
            <div>{children}</div>

            {/* Versão oculta para captura */}
            <div
                ref={hiddenRef}
                className="shareable-wrapper"
            >
                {children}
                <p className="shareable-wrapper-footer">
                    {siteName}
                </p>
            </div>

            {/* Botões */}
            {showButtons && (
                <div className='shareable-button-container'>
                    <button
                        onClick={handleDownload}
                        className='shareable-button'
                    >
                        <img className='shareable-button-image' src={`/assets/statics/download.svg`}></img>
                    </button>

                    {canShare && (
                        <button
                            onClick={handleNativeShare}
                            className='shareable-button'
                        >
                            <img className='shareable-button-image' src={`/assets/statics/share.svg`}></img>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ShareableWrapper;
