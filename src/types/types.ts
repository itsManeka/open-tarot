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
    visibility: "public" | "members" | "premium";
    createdAt: string;
    author: string;
    tags: string[];
    footer: Footer;
};

export type PageWithId = PageContent & { id: string };

export type NewsCardProps = {
    page: PageContent & { id: string };
};