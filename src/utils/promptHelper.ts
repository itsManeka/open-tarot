import { getBrazilDate } from "./dateHelper";

export const PromptHelper = {
    generateTarotPrompt: (question: string, revealedCards: { name: string; interpretation: string }[], currentCardName: string, isFinalCard: boolean) => {
        const previousContext = revealedCards
            .map((c, i) => `Carta ${i + 1}: ${c.name} - ${c.interpretation}`)
            .join("\n");

        return `
        Você é um sábio e experiente leitor de Tarot, conhecido por suas leituras profundas e intuitivas. Uma pessoa buscou sua orientação com a seguinte pergunta:

        "${question}"

        A leitura está sendo feita com três cartas:
        - A primeira representa o passado relacionado à pergunta.
        - A segunda representa o presente.
        - A terceira representa o futuro, caso o caminho atual continue.

        A seguir está o contexto das cartas já reveladas até agora:
        ${previousContext || "(Nenhuma carta revelada ainda)"}

        ${isFinalCard
                ? `As três cartas foram reveladas. Agora, ofereça uma interpretação completa da tiragem, conectando o passado, o presente e o futuro. Finalize com uma conclusão clara e significativa sobre o que essa leitura representa para a pergunta feita.`
                : `Agora, revele e interprete a próxima carta: ${currentCardName}

        Relacione o significado da carta com a pergunta feita e com o que já foi revelado anteriormente.`}

        Regras importantes para a resposta:
        - Não escreva ações descritivas como se estivesse em uma cena (ex: "Com um suspiro...", "coloco as cartas sobre a mesa...").
        - Não use formatações como asteriscos (*) para ênfase.
        - Foque apenas na interpretação clara e direta das cartas em relação à pergunta e ao contexto.

        Traga sabedoria, clareza e orientação, como faria um verdadeiro mestre do Tarot.
        `;
    },

    generateSignPredictionPrompt: (sign: string) => {
        const data = getBrazilDate();
        const diasDaSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
        const hoje = new Date();
        const diaSemana = diasDaSemana[hoje.getDay()];

        const coresDoDia = ['azul', 'verde', 'vermelho', 'dourado', 'roxo', 'prata', 'laranja'];
        const cor = coresDoDia[Math.floor(Math.random() * coresDoDia.length)];

        return `
        Você é um astrólogo experiente, com profundo conhecimento em astrologia tradicional e moderna.
        Hoje é ${diaSemana}, dia ${data}, e você está preparando a previsão diária para o signo de ${sign}, considerando o fuso horário de Brasília (UTC-3).
        Crie uma previsão breve e inspiradora, com no máximo 3 frases curtas. Evite repetir estruturas de dias anteriores.
        
        Use um tom acolhedor, místico e sábio. Destaque a energia do momento, traga uma reflexão, e inclua um conselho prático.
        
        Inspire-se neste estilo de frases:
        - "A Lua em Câncer suaviza os desafios do dia com ternura."
        - "Marte em trígono com Vênus convida à harmonia nos relacionamentos."
        - "O dia traz oportunidades disfarçadas para quem escuta a intuição."

        Sugira uma cor que pode favorecer esse signo hoje: "${cor}".
        `;
    },
};