import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { Input } from "../../components/common/Input";
import { useAuth } from "../../context/AuthContext";
import { izvuciPorukuGreske } from "../../utils/errorHelper";

type LoginLocationState = {
    poruka?: string;
    from?: { pathname: string; };
};

export const LoginPage = () => {

    const { prijava } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LoginLocationState | null;

    const [email, setEmail] = useState("");
    const [lozinka, setLozinka] = useState("");
    const [greska, setGreska] = useState<string | null>(null);
    const [ucitavanje, setUcitavanje] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setGreska(null);
        setUcitavanje(true);

        try {
            await prijava({ email, lozinka });
            navigate(state?.from?.pathname ?? "/dashboard", { replace: true });
        } catch (error: unknown) {
            setGreska(izvuciPorukuGreske(error, "Prijava nije uspela."));
        } finally {
            setUcitavanje(false);
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-card">
                <div className="auth-header">
                    <span className="auth-logo">K</span>
                    <h1>Prijava</h1>
                </div>

                {state?.poruka && <div className="success-message">{state.poruka}</div>}
                <ErrorMessage poruka={greska}/>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <Input 
                        label="Email" 
                        name="email" 
                        type="email" 
                        value={email} 
                        onChange={(event) => setEmail(event.target.value)} 
                        placeholder="korisnik@example.com"
                        required
                    />

                    <Input 
                        label="Lozinka"
                        name="lozinka"
                        type="password"
                        value={lozinka}
                        onChange={(event) => setLozinka(event.target.value)}
                        placeholder="********"
                        required
                    />

                    <Button type="submit" fullWidth isLoading={ucitavanje}>Prijava</Button>
                </form>

                <p className="auth-switch">Nemate nalog? <Link to="/registracija">Registrujte se</Link></p>
            </section>
        </main>
    );
};