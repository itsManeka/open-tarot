export type TarotCard = {
    number: number;
    name: string;
    image: string;
    type: "arcano-maior" | "arcano-menor";
};

export const tarotDeck: TarotCard[] = [
    // Arcanos Maiores
    { number: 0, name: "O Louco", image: "/assets/tarot/o-louco.jpg", type: "arcano-maior" },
    { number: 1, name: "O Mago", image: "/assets/tarot/o-mago.jpg", type: "arcano-maior" },
    { number: 2, name: "A Sacerdotisa", image: "/assets/tarot/a-sacerdotisa.jpg", type: "arcano-maior" },
    { number: 3, name: "A Imperatriz", image: "/assets/tarot/a-imperatriz.jpg", type: "arcano-maior" },
    { number: 4, name: "O Imperador", image: "/assets/tarot/o-imperador.jpg", type: "arcano-maior" },
    { number: 5, name: "O Papa", image: "/assets/tarot/o-papa.jpg", type: "arcano-maior" },
    { number: 6, name: "Os Enamorados", image: "/assets/tarot/os-enamorados.jpg", type: "arcano-maior" },
    { number: 7, name: "O Carro", image: "/assets/tarot/o-carro.jpg", type: "arcano-maior" },
    { number: 8, name: "A Força", image: "/assets/tarot/a-forca.jpg", type: "arcano-maior" },
    { number: 9, name: "O Eremita", image: "/assets/tarot/o-eremita.jpg", type: "arcano-maior" },
    { number: 10, name: "A Roda da Fortuna", image: "/assets/tarot/a-roda-da-fortuna.jpg", type: "arcano-maior" },
    { number: 11, name: "A Justiça", image: "/assets/tarot/a-justica.jpg", type: "arcano-maior" },
    { number: 12, name: "O Enforcado", image: "/assets/tarot/o-enforcado.jpg", type: "arcano-maior" },
    { number: 13, name: "A Morte", image: "/assets/tarot/a-morte.jpg", type: "arcano-maior" },
    { number: 14, name: "A Temperança", image: "/assets/tarot/a-temperanca.jpg", type: "arcano-maior" },
    { number: 15, name: "O Diabo", image: "/assets/tarot/o-diabo.jpg", type: "arcano-maior" },
    { number: 16, name: "A Torre", image: "/assets/tarot/a-torre.jpg", type: "arcano-maior" },
    { number: 17, name: "A Estrela", image: "/assets/tarot/a-estrela.jpg", type: "arcano-maior" },
    { number: 18, name: "A Lua", image: "/assets/tarot/a-lua.jpg", type: "arcano-maior" },
    { number: 19, name: "O Sol", image: "/assets/tarot/o-sol.jpg", type: "arcano-maior" },
    { number: 20, name: "O Julgamento", image: "/assets/tarot/o-julgamento.jpg", type: "arcano-maior" },
    { number: 21, name: "O Mundo", image: "/assets/tarot/o-mundo.jpg", type: "arcano-maior" },

    // Arcanos Menores
    // Paus
    { number: 22, name: "Ás de Paus", image: "/assets/tarot/as-de-paus.jpg", type: "arcano-menor" },
    { number: 23, name: "Dois de Paus", image: "/assets/tarot/dois-de-paus.jpg", type: "arcano-menor" },
    { number: 24, name: "Três de Paus", image: "/assets/tarot/tres-de-paus.jpg", type: "arcano-menor" },
    { number: 25, name: "Quatro de Paus", image: "/assets/tarot/quatro-de-paus.jpg", type: "arcano-menor" },
    { number: 26, name: "Cinco de Paus", image: "/assets/tarot/cinco-de-paus.jpg", type: "arcano-menor" },
    { number: 27, name: "Seis de Paus", image: "/assets/tarot/seis-de-paus.jpg", type: "arcano-menor" },
    { number: 28, name: "Sete de Paus", image: "/assets/tarot/sete-de-paus.jpg", type: "arcano-menor" },
    { number: 29, name: "Oito de Paus", image: "/assets/tarot/oito-de-paus.jpg", type: "arcano-menor" },
    { number: 30, name: "Nove de Paus", image: "/assets/tarot/nove-de-paus.jpg", type: "arcano-menor" },
    { number: 31, name: "Dez de Paus", image: "/assets/tarot/dez-de-paus.jpg", type: "arcano-menor" },
    { number: 32, name: "Valete de Paus", image: "/assets/tarot/valete-de-paus.jpg", type: "arcano-menor" },
    { number: 33, name: "Cavaleiro de Paus", image: "/assets/tarot/cavaleiro-de-paus.jpg", type: "arcano-menor" },
    { number: 34, name: "Rainha de Paus", image: "/assets/tarot/rainha-de-paus.jpg", type: "arcano-menor" },
    { number: 35, name: "Rei de Paus", image: "/assets/tarot/rei-de-paus.jpg", type: "arcano-menor" },

    // Copas
    { number: 36, name: "Ás de Copas", image: "/assets/tarot/as-de-copas.jpg", type: "arcano-menor" },
    { number: 37, name: "Dois de Copas", image: "/assets/tarot/dois-de-copas.jpg", type: "arcano-menor" },
    { number: 38, name: "Três de Copas", image: "/assets/tarot/tres-de-copas.jpg", type: "arcano-menor" },
    { number: 39, name: "Quatro de Copas", image: "/assets/tarot/quatro-de-copas.jpg", type: "arcano-menor" },
    { number: 40, name: "Cinco de Copas", image: "/assets/tarot/cinco-de-copas.jpg", type: "arcano-menor" },
    { number: 41, name: "Seis de Copas", image: "/assets/tarot/seis-de-copas.jpg", type: "arcano-menor" },
    { number: 42, name: "Sete de Copas", image: "/assets/tarot/sete-de-copas.jpg", type: "arcano-menor" },
    { number: 43, name: "Oito de Copas", image: "/assets/tarot/oito-de-copas.jpg", type: "arcano-menor" },
    { number: 44, name: "Nove de Copas", image: "/assets/tarot/nove-de-copas.jpg", type: "arcano-menor" },
    { number: 45, name: "Dez de Copas", image: "/assets/tarot/dez-de-copas.jpg", type: "arcano-menor" },
    { number: 46, name: "Valete de Copas", image: "/assets/tarot/valete-de-copas.jpg", type: "arcano-menor" },
    { number: 47, name: "Cavaleiro de Copas", image: "/assets/tarot/cavaleiro-de-copas.jpg", type: "arcano-menor" },
    { number: 48, name: "Rainha de Copas", image: "/assets/tarot/rainha-de-copas.jpg", type: "arcano-menor" },
    { number: 49, name: "Rei de Copas", image: "/assets/tarot/rei-de-copas.jpg", type: "arcano-menor" },

    // Espadas
    { number: 50, name: "Ás de Espadas", image: "/assets/tarot/as-de-espadas.jpg", type: "arcano-menor" },
    { number: 51, name: "Dois de Espadas", image: "/assets/tarot/dois-de-espadas.jpg", type: "arcano-menor" },
    { number: 52, name: "Três de Espadas", image: "/assets/tarot/tres-de-espadas.jpg", type: "arcano-menor" },
    { number: 53, name: "Quatro de Espadas", image: "/assets/tarot/quatro-de-espadas.jpg", type: "arcano-menor" },
    { number: 54, name: "Cinco de Espadas", image: "/assets/tarot/cinco-de-espadas.jpg", type: "arcano-menor" },
    { number: 55, name: "Seis de Espadas", image: "/assets/tarot/seis-de-espadas.jpg", type: "arcano-menor" },
    { number: 56, name: "Sete de Espadas", image: "/assets/tarot/sete-de-espadas.jpg", type: "arcano-menor" },
    { number: 57, name: "Oito de Espadas", image: "/assets/tarot/oito-de-espadas.jpg", type: "arcano-menor" },
    { number: 58, name: "Nove de Espadas", image: "/assets/tarot/nove-de-espadas.jpg", type: "arcano-menor" },
    { number: 59, name: "Dez de Espadas", image: "/assets/tarot/dez-de-espadas.jpg", type: "arcano-menor" },
    { number: 60, name: "Valete de Espadas", image: "/assets/tarot/valete-de-espadas.jpg", type: "arcano-menor" },
    { number: 61, name: "Cavaleiro de Espadas", image: "/assets/tarot/cavaleiro-de-espadas.jpg", type: "arcano-menor" },
    { number: 62, name: "Rainha de Espadas", image: "/assets/tarot/rainha-de-espadas.jpg", type: "arcano-menor" },
    { number: 63, name: "Rei de Espadas", image: "/assets/tarot/rei-de-espadas.jpg", type: "arcano-menor" },

    // Ouros
    { number: 64, name: "Ás de Ouros", image: "/assets/tarot/as-de-ouros.jpg", type: "arcano-menor" },
    { number: 65, name: "Dois de Ouros", image: "/assets/tarot/dois-de-ouros.jpg", type: "arcano-menor" },
    { number: 66, name: "Três de Ouros", image: "/assets/tarot/tres-de-ouros.jpg", type: "arcano-menor" },
    { number: 67, name: "Quatro de Ouros", image: "/assets/tarot/quatro-de-ouros.jpg", type: "arcano-menor" },
    { number: 68, name: "Cinco de Ouros", image: "/assets/tarot/cinco-de-ouros.jpg", type: "arcano-menor" },
    { number: 69, name: "Seis de Ouros", image: "/assets/tarot/seis-de-ouros.jpg", type: "arcano-menor" },
    { number: 70, name: "Sete de Ouros", image: "/assets/tarot/sete-de-ouros.jpg", type: "arcano-menor" },
    { number: 71, name: "Oito de Ouros", image: "/assets/tarot/oito-de-ouros.jpg", type: "arcano-menor" },
    { number: 72, name: "Nove de Ouros", image: "/assets/tarot/nove-de-ouros.jpg", type: "arcano-menor" },
    { number: 73, name: "Dez de Ouros", image: "/assets/tarot/dez-de-ouros.jpg", type: "arcano-menor" },
    { number: 74, name: "Valete de Ouros", image: "/assets/tarot/valete-de-ouros.jpg", type: "arcano-menor" },
    { number: 75, name: "Cavaleiro de Ouros", image: "/assets/tarot/cavaleiro-de-ouros.jpg", type: "arcano-menor" },
    { number: 76, name: "Rainha de Ouros", image: "/assets/tarot/rainha-de-ouros.jpg", type: "arcano-menor" },
    { number: 77, name: "Rei de Ouros", image: "/assets/tarot/rei-de-ouros.jpg", type: "arcano-menor" }
];
