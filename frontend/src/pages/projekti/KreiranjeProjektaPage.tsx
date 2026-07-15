import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { kreirajProjekat } from "../../api/ProjekatApi";
import { izvuciPorukuGreske } from "../../utils/errorHelper";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { Input } from "../../components/common/Input";
import { Textarea } from "../../components/common/Textarea";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";

export const KreiranjeProjektaPage = () => {

    const navigate = useNavigate();

    const [naziv, setNaziv] = useState("");
    const [opis, setOpis] = useState("");
    const [ucitavanje, setUcitavanje] = useState(false);
    const [greska, setGreska] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setGreska(null);
        setUcitavanje(true);

        try {
            const projekat = await kreirajProjekat({ naziv, opis });
            
            navigate(`/projekti/${projekat.id}`);
        } catch (error: unknown) {
            setGreska(izvuciPorukuGreske(error, "Projekat nije kreiran."));
        } finally {
            setUcitavanje(false);
        }
    };

    return (
        <div className="form-page">
            <div className="page-actions">
                <div>
                    <p className="eyebrow">Novi projekat</p>
                    <h2>Kreiranje projekta</h2>
                    <p className="muted-text">Nakon kreiranja projekta automatski postajete vlasnik i član.</p>
                </div>
                <Link className="btn btn-secondary" to="/projekti">Nazad</Link>
            </div>

            <Card>
                <ErrorMessage poruka={greska} />

                <form className="standard-form" onSubmit={handleSubmit}>
                    <Input
                        label="Naziv projekta"
                        name="naziv"
                        value={naziv}
                        onChange={(event) => setNaziv(event.target.value)}
                        placeholder="Unesite naziv..."
                        required
                    />
                    <Textarea
                        label="Opis projekta"
                        name="opis"
                        value={opis}
                        onChange={(event) => setOpis(event.target.value)}
                        placeholder="Opišite projekat..."
                    />
                    <div className="form-actions">
                        <Link className="btn btn-ghost" to="/projekti">Odustani</Link>
                        <Button type="submit" isLoading={ucitavanje}>Sačuvaj</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};