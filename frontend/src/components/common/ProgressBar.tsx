type ProgressBarProps = {
    value: number;
};

export const ProgressBar = ({ value }: ProgressBarProps) => {

    const normalizedValue = Math.min(100, Math.max(0, value));

    return (
        <div className="progress-bar" aria-label={`Napredak ${normalizedValue}%`}>
            <div className="progress-bar-fill" style={{ width: `${normalizedValue}%`}}/>
        </div>
    );
};