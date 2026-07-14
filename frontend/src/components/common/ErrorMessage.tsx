type ErrorMessageProps = {
    poruka?: string | null;
};

export const ErrorMessage = ({ poruka }: ErrorMessageProps) => {

    if (!poruka) {
        return null;
    }

    return <div className="error-message">{poruka}</div>
};