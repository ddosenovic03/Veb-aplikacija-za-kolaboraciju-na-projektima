import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const odrediNaslovStranice = (pathname: string) => {
    if (pathname.startsWith("/dashboard")) return "Dashboard";
    if (pathname.startsWith("/projekti")) return "Projekti";
    if (pathname.startsWith("/pozivi")) return "Pozivi";
    if (pathname.startsWith("/moji-poslovi")) return "Moji poslovi";
    if (pathname.startsWith("/kreirani-poslovi")) return "Kreirani poslovi";

    return "Aplikacija";
};

export const Header = () => {

    const location = useLocation();
    const { korisnik } = useAuth();

    return (
        <header className="app-header">
            <div>
                <h1>{odrediNaslovStranice(location.pathname)}</h1>
                <p>Veb aplikacija za kolaboraciju na projektima</p>
            </div>

            {korisnik && (
                <div className="user-chip">
                    <span>{korisnik.ime.charAt(0)}</span>
                    <div>
                        <strong>{korisnik.ime} {korisnik.prezime}</strong>
                        <small>{korisnik.korisnicko_ime}</small>
                    </div>
                </div>
            )}
        </header>
    );
};