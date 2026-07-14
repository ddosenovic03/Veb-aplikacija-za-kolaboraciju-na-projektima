type BadgeProps = {
    children: string;
    variant?: "default" | "success" | "warning" | "danger"
};

export const Badge = ({ children, variant = "default" }: BadgeProps) => {

    return <span className={`badge badge-${variant}`}>{children}</span>
};