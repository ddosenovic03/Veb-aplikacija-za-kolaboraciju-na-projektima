type PlaceholderPageProps = {
    title: string;
    description: string;
};

export const PlaceholderPage = ({ title, description }: PlaceholderPageProps) => {

    return (
        <section className="placeholder-page">
            <p className="eyebrow">U pripremi</p>
            <h2>{title}</h2>
            <p>{description}</p>
        </section>
    );
};