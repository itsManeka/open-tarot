export type Section = {
    heading: string;
    body: string;
};

export type SocialLink = {
    type: string;
    url: string;
};

export type Footer = {
    description: string;
    socialLinks: SocialLink[];
}

export type PageContent = {
    title: string;
    img: string;
    sections: Section[];
    visibility: "public" | "members" | "premium" | "institutional";
    createdAt: string;
    author: string;
    tags: string[];
    footer: Footer;
    components: string[];
};

export type PageWithId = PageContent & { id: string };

export type NewsCardProps = {
    page: PageContent & { id: string };
};

export type ImageOption = {
    label: string;
    url: string;
};

export type UserProfile = {
    dataNascimento: string;
    horarioNascimento: string;
    localNascimento: string;
    nome: string;
    sobrenome: string;
    pronomes: string[];
};

export type StripeProduct = {
    name: string;
    description: string;
    images: string[];
}

export type StripePrice = {
    id: string;
    product: StripeProduct;
    unit_amount: number;
    currency: string;
}

export type StripeSession = {
    sessionId: string;
    status: string;
    product: StripeProduct;
    amountTotal: number;
    currency: string
}