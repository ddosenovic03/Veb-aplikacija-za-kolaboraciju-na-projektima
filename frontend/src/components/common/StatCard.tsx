type StatCardProps = {
    label: string;
    value: number;
    description: string;
};

export const StatCard = ({ label, value, description }: StatCardProps) => {

    return (
        <article className="stat-card">
            <p className="stat-label">{label}</p>
            <strong className="stat-value">{value}</strong>
            <span className="stat-description">{description}</span>
        </article>
    );
};