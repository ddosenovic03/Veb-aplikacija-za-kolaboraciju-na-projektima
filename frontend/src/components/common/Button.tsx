import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    variant?: ButtonVariant;
    fullWidth?: boolean;
    isLoading?: boolean;
};

export const Button = ({ children, variant = "primary", fullWidth = false, isLoading = false, className = "", disabled, ...props }: ButtonProps) => {

    const classes = ["btn", `btn-${variant}`, fullWidth ? "btn-full" : "", className].filter(Boolean).join(" ");

    return (
        <button className={classes} disabled={disabled || isLoading} {...props}>
            {isLoading ? "Učitavanje..." : children}
        </button>
    );
};