export const StringHelper = {
    strNormalize: (str: string) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    },

    loremIpsum: (n?: number) => {
        const count = n ?? 1;
        return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.".repeat(count);
    },

    sanitizeId: (value: string) => {
        return value
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s-]/gi, "")
            .replace(/\s+/g, "-")
            .toLowerCase();
    },

    isValidId: (value: string) => /^[a-z0-9\-]+$/.test(value) && value.length > 0,

    isValidUrl: (url: string): boolean => {
        try {
            const u = new URL(url);
            return u.protocol === "https:" || u.protocol === "http:";
        } catch (_) {
            return false;
        }
    },

    formatPrice: (value: string | number, currency: string = 'BLR') => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency.toUpperCase(),
        }).format(Number(value));
    },

    formatSignPosition: (grau: number) => {
        return `${grau.toFixed(0)}°`;
    },

    mostFrequentWord: (texto: string) => {
        const palavras = texto
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/);

        const contagem: Record<string, number> = {};

        for (const palavra of palavras) {
            if (palavra.length > 3) {
                contagem[palavra] = (contagem[palavra] || 0) + 1;
            }
        }

        let maisFrequente = '';
        let max = 0;

        for (const [palavra, quantidade] of Object.entries(contagem)) {
            if (quantidade > max) {
                max = quantidade;
                maisFrequente = palavra;
            }
        }

        return maisFrequente;
    }
}