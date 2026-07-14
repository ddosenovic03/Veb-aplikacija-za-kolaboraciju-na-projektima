import type { ReactNode } from "react";

type CardProps = {
    title?: string;
    children: ReactNode;
    className?: string;
};

export const Card = ({ title, children, className = "" }: CardProps) => {

    return (
        <section className={`card ${className}`}>
            {title && <h2 className="card-title">{title}</h2>}
            {children}
        </section>
    );
};