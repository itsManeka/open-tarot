export const StringHelper = {
    strNormalize: (str: string) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    },

    loremIpsum: () => {
        return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
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

    formatPrice: (value: string | number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(Number(value));
    },
}