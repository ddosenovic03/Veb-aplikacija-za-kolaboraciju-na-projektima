import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    error?: string;
};

export const Textarea = ({ label, error, id, className = "", ...props }: TextareaProps) => {

    const textareaId = id ?? props.name;

    return (
        <div className="form-group">
            <label htmlFor={textareaId}>{label}</label>
            <textarea id={textareaId} className={`form-control form-textarea ${className}`} {...props} />
            {error && <p className="field-error">{error}</p>}
        </div>
    );
};