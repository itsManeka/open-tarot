type NiceHelmetMeta = {
    name: string;
    content: string;
}

type NiceHelmetProps = {
    title: string;
    meta?: NiceHelmetMeta[];
};

export function NiceHelmet({ title, meta = [] }: NiceHelmetProps) {
    return (
        <>
            <title>{title}</title>
            {meta.map((m, index) => (
                <meta key={index} name={m.name} content={m.content} />
            ))}
        </>
    )
}