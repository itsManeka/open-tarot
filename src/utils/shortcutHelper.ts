export const ShortcutHelper = {
    getTarotShorcut: () => {
        const route= "/question";
        const title= "Descubra o que o Tarot revela para você";
        const imageSrc= "/assets/statics/cards.svg";
        const imageAlt= "Ícone mostrando cartas de tarot empilhadas";
        const buttonAlt= "Comece sua tiragem";
        const description= `Conecte-se com sua intuição e explore as mensagens do universo com uma tiragem de tarot online personalizada.
                            Nosso site oferece uma experiência mágica e acessível, onde cada carta traz um novo olhar sobre sua jornada.\\n
                            Tire um momento para si e receba interpretações únicas através de Inteligência Artificial que podem iluminar seu caminho.`;

        return {route, title, imageSrc, imageAlt, buttonAlt, description}
    },

    getDreamShortcut: () => {
        const route= "/dream";
        const title= "Busque a revelação através de seus sonhos";
        const imageSrc= "/assets/statics/dreams.svg";
        const imageAlt= "Ícone mostrando uma janela para a noite com uma lua, nuvens e estrelas";
        const buttonAlt= "Interprete seu sonho";
        const description= `Descubra os segredos ocultos dos seus sonhos com nosso interpretador de sonhos online.
                            Nosso site oferece uma experiência intuitiva e acessível, onde cada símbolo onírico ganha vida com a ajuda da Inteligência Artificial.\\n
                            Conecte-se com o universo do inconsciente, explore significados profundos e receba interpretações personalizadas que podem revelar mensagens valiosas para sua jornada interior.\n
                            Tire um momento para si e mergulhe no mistério dos seus sonhos — eles podem estar tentando te dizer algo importante.`;

        return {route, title, imageSrc, imageAlt, buttonAlt, description}
    },
}