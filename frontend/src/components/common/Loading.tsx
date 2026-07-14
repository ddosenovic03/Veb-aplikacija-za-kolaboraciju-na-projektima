type LoadingProps = {
    tekst?: string;
}

export const Loading = ({ tekst = "Učitavanje..." }: LoadingProps) => {

    return <div className="loading-box">{tekst}</div>
};