import "./ContactForm.css";

export default function ContactForm() {
    return (
        <form
            className="contact-form"
            name="form"
            id="form"
            action="https://forms.zohopublic.com/contatoopen1/form/ContatoOpenTarot/formperma/KXwiOGjOYUAmeHRtdHkQP6ymWOkGkH6jWaawwrgJIyI/htmlRecords/submit"
            method="POST"
            accept-charset='UTF-8'
            target="_blank"
        >
            <h2>Entre em contato</h2>

            <label htmlFor="SingleLine">Nome</label>
            <input
                id="SingleLine"
                name="SingleLine"
                type="text"
                placeholder="Seu nome"
                required
            />

            <label htmlFor="Email">Email</label>
            <input
                id="Email"
                name="Email"
                type="email"
                placeholder="Seu email"
                required
            />

            <label htmlFor="MultiLine">Mensagem</label>
            <textarea
                id="MultiLine"
                name="MultiLine"
                placeholder="Sua mensagem"
                required
            />

            <button type="submit">
                Enviar
            </button>
        </form>
    );
}
