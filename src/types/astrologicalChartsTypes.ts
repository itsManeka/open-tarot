export type Stars = {
    id: number;
    nome: string;
    signo: string;
    grau: number;
    grauZodiaco: number;
    classificacao: string;
    elemento: string;
    modalidade: string;
    polaridade: string;
    peso: number;
}

export type Houses = {
    casa: number;
    grau: number;
    grauZodiaco: number;
    signo: string;
}

export type Elements = {
    agua: number;
    terra: number;
    ar: number;
    fogo: number;
}

export type Modalitys = {
    mutavel: number;
    fixo: number;
    cardinal: number;
}

export type Polaritys = {
    negativa: number;
    positiva: number;
}

export type Distributions = {
    elementos: Elements;
    modalidades: Modalitys;
    polaridades: Polaritys;
}

export type Atributes = {
    tonica: string;
    regentes: string[];
}

export type LifePath = {
    bruto: number;
    final: number;
    representacao: string;
}

export type Numerology = {
    caminhoDaVida: LifePath;
    numeroDestino: number;
}

export type AstrologicalChartData = {
    astros: Stars[];
    casas: Houses[];
    distribuicao: Distributions;
    atributos: Atributes;
    numerologia: Numerology;
}

export type HousesInterpretation = Record<string, string>;

export const STARS_IMG: Record<string, string> = {
    "Sol": "sun", "Lua": "moon", "Mercúrio": "mercury", "Vênus": "venus",
    "Marte": "mars", "Júpiter": "jupiter", "Saturno": "saturn",
    "Urano": "uranus", "Netuno": "neptune", "Plutão": "pluto",
    "Lilith": "lilith", "Quíron": "chiron", "Pholus": "pholus",
    "Ceres": "ceres", "Palas": "pallas", "Juno": "juno",
    "Vesta": "vesta", "Nodo Norte": "n_node", "Nodo Sul": "s_node",
    "Parte da Fortuna": "fortune", "Ascendente": "asc",
    "Descendente": "desc", "Meio do Céu": "mc",
    "Fundo do Céu": "ic", "Vertex": "vertex"
}

export const HOUSE_TAGS: Record<number, string[]> = {
    1: ["identidade", "ego", "aparência", "começos"],
    2: ["dinheiro", "posses", "autoestima", "valores"],
    3: ["comunicação", "aprendizado", "irmãos", "cotidiano"],
    4: ["família", "lar", "emoções", "raízes"],
    5: ["criatividade", "romance", "filhos", "prazer"],
    6: ["trabalho", "saúde", "rotina", "disciplina"],
    7: ["relacionamentos", "casamento", "parcerias", "outro"],
    8: ["intimidade", "transformação", "heranças", "sexualidade"],
    9: ["filosofia", "viagens", "conhecimento", "espiritualidade"],
    10: ["carreira", "status", "autoridade", "reputação"],
    11: ["amizades", "futuro", "grupos", "inovação"],
    12: ["espiritualidade", "inconsciente", "sacrifício", "isolamento"],
};