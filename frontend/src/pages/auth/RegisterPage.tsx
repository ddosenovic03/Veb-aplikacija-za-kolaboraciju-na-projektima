import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { Input } from "../../components/common/Input";
import { useAuth } from "../../context/AuthContext";
import { izvuciPorukuGreske } from "../../utils/errorHelper";

export const RegisterPage = () => {

    const { registracija } = useAuth();
    const navigate = useNavigate();

    const [ime, setIme] = useState("");
    const [prezime, setPrezime] = useState("");
    const [korisnickoIme, setKorisnickoIme] = useState("");
    const [email, setEmail] = useState("");
    const [lozinka, setLozinka] = useState("");
    const [greska, setGreska] = useState<string | null>(null);
    const [ucitavanje, setUcitavanje] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setGreska(null);
        setUcitavanje(true);

        try {
            await registracija({ ime, prezime, korisnicko_ime: korisnickoIme, email, lozinka });

            navigate("/login", { replace: true, state: { poruka: "Registracija je uspešna. Možete da se prijavite." } });
        } catch (error: unknown) {
            setGreska(izvuciPorukuGreske(error, "Registracija nije uspela."));
        } finally {
            setUcitavanje(false);
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-card auth-card-wide">
                <div className="auth-header">
                    <span className="auth-logo">K</span>
                    <h1>Registracija</h1>
                </div>

                <ErrorMessage poruka={greska} />

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-grid two-columns">
                        <Input
                            label="Ime"
                            name="ime"
                            value={ime}
                            onChange={(event) => setIme(event.target.value)}
                            placeholder="Unesite ime"
                            required
                        />

                        <Input
                            label="Prezime"
                            name="prezime"
                            value={prezime}
                            onChange={(event) => setPrezime(event.target.value)}
                            placeholder="Unesite prezime"
                            required
                        />
                    </div>

                    <Input
                        label="Korisničko ime"
                        name="korisnicko_ime"
                        value={korisnickoIme}
                        onChange={(event) => setKorisnickoIme(event.target.value)}
                        placeholder="Unesite korisničko ime"
                        required
                    />

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

                    <Button type="submit" fullWidth isLoading={ucitavanje}>Registracija</Button>
                </form>

                <p className="auth-switch">Već imate nalog? <Link to="/login">Prijavite se</Link></p>
            </section>
        </main>
    );
};