import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "../common/Button";
import { useAuth } from "../../context/AuthContext";

const navigacija = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/projekti", label: "Projekti" },
    { to: "/pozivi", label: "Pozivi" },
    { to: "/moji-poslovi", label: "Moji poslovi" },
    { to: "/kreirani-poslovi", label: "Kreirani poslovi" }
];

export const Sidebar = () => {

    const { odjava } = useAuth();
    const navigate = useNavigate();
    const handleOdjava = () => {
        odjava();
        navigate("/login", { replace: true });
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <span className="brand-mark">K</span>
                <div>
                    <strong>Kolaboracija</strong>
                    <small>Projektni rad</small>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navigacija.map((item) => (
                    <NavLink key={item.to} to={item.to} className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                        {item.label}    
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <Button variant="ghost" fullWidth onClick={handleOdjava}>
                    Odjava
                </Button>
            </div>
        </aside>
    );
};