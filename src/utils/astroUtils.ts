import { Stars, Houses } from "../types/astrologicalChartsTypes"

export function mapPlanetsToHouses(stars: Stars[], houses: Houses[]): Record<number, Stars[]> {
    const sortedCasas = houses.sort((a, b) => a.casa - b.casa);
    const result: Record<number, Stars[]> = {};

    for (let i = 0; i < 12; i++) {
        const houseNumber = i + 1;
        const start = sortedCasas[i].grauZodiaco;
        const end = sortedCasas[(i + 1) % 12].grauZodiaco;

        result[houseNumber] = stars.filter((astro) => {
            const grau = astro.grauZodiaco;
            if (start < end) {
                return grau >= start && grau < end;
            } else {
                return grau >= start || grau < end;
            }
        });
    }

    return result;
}
