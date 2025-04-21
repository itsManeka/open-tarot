export function getBrazilDate(): string {
    const hoje = new Date();
    const dataFormatada = hoje
        .toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
        .split('/')
        .join('-');
    return dataFormatada;
}

export function formatDateForDisplay(dateStrOrDate: string | Date): string {
    const date = typeof dateStrOrDate === 'string' ? new Date(dateStrOrDate) : dateStrOrDate;

    return date.toLocaleDateString(navigator.language, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

export function formatDateTimeForDisplay(dateStrOrDate: string | Date): string {
    const date = typeof dateStrOrDate === 'string' ? new Date(dateStrOrDate) : dateStrOrDate;

    return date.toLocaleString(navigator.language, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    })
}