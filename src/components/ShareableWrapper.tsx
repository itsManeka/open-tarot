import React, { /*useEffect,*/ useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import './ShareableWrapper.css';
import { Download, Ellipsis, Share2 } from 'lucide-react';

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
    const [isLoading, setIsLoading] = useState(false);

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
    
        const svgToPng = async (svgUrl: string): Promise<string> => {
            const res = await fetch(svgUrl);
            const svgText = await res.text();
    
            const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(svgBlob);
    
            const img = new Image();
            img.src = url;
    
            return new Promise((resolve) => {
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width || 64;
                    canvas.height = img.height || 64;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0);
                        const pngUrl = canvas.toDataURL('image/png');
                        URL.revokeObjectURL(url);
                        resolve(pngUrl);
                    }
                };
            });
        };
    
        const swapSvgsForPngs = async () => {
            const wrappers = hiddenRef.current!.querySelectorAll('[data-snapshot-img]');
            for (const wrapper of wrappers) {
                const imgs = wrapper.querySelectorAll('img');
                for (const img of imgs) {
                    const originalSrc = img.src;
                    img.setAttribute('data-original-src', originalSrc);
                    const pngDataUrl = await svgToPng(originalSrc);
                    img.src = pngDataUrl;
                }
    
                const svgImages = wrapper.querySelectorAll('image');
                for (const svgImage of svgImages) {
                    if (svgImage) {
                        const href = svgImage.getAttribute('href') || svgImage.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
                        if (href) {
                            svgImage.setAttribute('data-original-href', href);
                            const pngDataUrl = await svgToPng(href);
                            svgImage.setAttribute('href', pngDataUrl);
                            svgImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', pngDataUrl);
                        }
                    }
                }
            }
        };
    
        const restoreOriginalSvgs = () => {
            const wrappers = hiddenRef.current!.querySelectorAll('[data-snapshot-img]');
            wrappers.forEach(wrapper => {
                const imgs = wrapper.querySelectorAll('img');
                for (const img of imgs) {
                    if (img && img.hasAttribute('data-original-src')) {
                        img.src = img.getAttribute('data-original-src')!;
                        img.removeAttribute('data-original-src');
                    }
                }
    
                const svgImages = wrapper.querySelectorAll('image');
                for (const svgImage of svgImages) {
                    if (svgImage && svgImage.hasAttribute('data-original-href')) {
                        const originalHref = svgImage.getAttribute('data-original-href')!;
                        svgImage.setAttribute('href', originalHref);
                        svgImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', originalHref);
                        svgImage.removeAttribute('data-original-href');
                    }
                }
            });
        };
    
        await swapSvgsForPngs();
    
        const canvas = await html2canvas(hiddenRef.current, {
            backgroundColor: null,
            useCORS: true,
            scale: 2,
        });
    
        restoreOriginalSvgs();
    
        const targetWidth = 1080;
        const targetHeight = 1920;
        const resizedCanvas = document.createElement('canvas');
        resizedCanvas.width = targetWidth;
        resizedCanvas.height = targetHeight;
    
        const ctx = resizedCanvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#121212';
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
        setIsLoading(true);
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
        setIsLoading(false);
    };

    const handleNativeShare = async () => {
        setIsLoading(true);
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
        setIsLoading(false);
    };

    const canShare = typeof navigator !== 'undefined' &&
        navigator.canShare &&
        navigator.canShare({ files: [new File([], '')] });

    return (
        <div className='shareable-wrapper-container'>
            <div>{children}</div>

            <div
                ref={hiddenRef}
                className="shareable-wrapper"
            >
                {children}
                <p className="shareable-wrapper-footer">
                    {siteName}
                </p>
            </div>

            {showButtons && (
                <div className='shareable-button-container'>
                    <button
                        onClick={handleDownload}
                        className='shareable-button'
                        disabled={isLoading}
                    >
                        {isLoading ? <Ellipsis /> : <Download />}
                    </button>

                    {canShare && (
                        <button
                            onClick={handleNativeShare}
                            className='shareable-button'
                            disabled={isLoading}
                        >
                            {isLoading ? <Ellipsis /> : <Share2 />}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ShareableWrapper;
