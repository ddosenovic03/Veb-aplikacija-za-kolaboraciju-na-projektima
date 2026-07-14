import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string,
    error?: string
};

export const Input = ({ label, error, id, className = "", ...props}: InputProps) => {

    const inputId = id ?? props.name;

    return (
        <div className="form-group">
            <label htmlFor={inputId}>{label}</label>
            <input id={inputId} className={`form-control ${className}`} {...props} />
            {error && <p className="field-error">{error}</p>}
        </div>
    )
};