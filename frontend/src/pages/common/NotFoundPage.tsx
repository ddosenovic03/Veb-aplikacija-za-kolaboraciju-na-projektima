import { Link } from "react-router-dom";

export const NotFoundPage = () => {

    return (
        <main className="not-found-page">
            <h1>404</h1>
            <p>Stranica koju tražite ne postoji.</p>
            <Link to="/dashboard">Vratite se na dashboard</Link>
        </main>
    );
};