import { DateTime } from 'luxon';

export function getBrazilDate(): string {
    const hoje = new Date();
    const dataFormatada = hoje
        .toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
        .split('/')
        .join('-');
    return dataFormatada;
}

export function getBrazilDateTime(): string {
    const agora = new Date();
    const opcoes: Intl.DateTimeFormatOptions = {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    };

    const formatado = agora.toLocaleString('pt-BR', opcoes);

    const [data, hora] = formatado.split(', ');
    const dataFormatada = data.split('/').join('-');

    return `${dataFormatada} às ${hora}`;
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

export function formatCountdown(ms: number): string {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
};


export function convertBrazilDateTimeToUTC(dateStr: string, timeStr: string): string {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hour, minute] = timeStr.split(':').map(Number);

    const dateInBrazil = DateTime.fromObject(
        { year, month, day, hour, minute },
        { zone: 'America/Sao_Paulo' }
    );

    return dateInBrazil.toUTC().toFormat('HH:mm');
}

export function convertBrazilDateToUTC(dateStr: string): string {
    const [year, month, day] = dateStr.split('-').map(Number);

    const dateInBrazil = DateTime.fromObject(
        { year, month, day, hour: 12 },
        { zone: 'America/Sao_Paulo' }
    );

    return dateInBrazil.toUTC().toISODate() ?? '';
}