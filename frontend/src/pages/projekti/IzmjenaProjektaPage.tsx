import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { dobaviDetaljeProjekta, izmijeniProjekat } from "../../api/ProjekatApi";
import { izvuciPorukuGreske } from "../../utils/errorHelper";
import { Loading } from "../../components/common/Loading";
import { Card } from "../../components/common/Card";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { Input } from "../../components/common/Input";
import { Textarea } from "../../components/common/Textarea";
import { Button } from "../../components/common/Button";

export const IzmjenaProjektaPage = () => {

    const { projekatId: projekatIdParam } = useParams();
    const projekatId = Number(projekatIdParam);
    const navigate = useNavigate();

    const [naziv, setNaziv] = useState("");
    const [opis, setOpis] = useState("");
    const [ucitavanje, setUcitavanje] = useState(true);
    const [cuvanje, setCuvanje] = useState(false);
    const [greska, setGreska] = useState<string | null>(null);

    useEffect(() => {
        let aktivnaKomponenta = true;

        const ucitajProjekat = async () => {
            if (!Number.isInteger(projekatId) || projekatId <= 0) {
                setGreska("ID projekta nije validan.");
                setUcitavanje(false);
                return;
            }

            try {
                const projekat = await dobaviDetaljeProjekta(projekatId);

                if (aktivnaKomponenta) {
                    setNaziv(projekat.naziv);
                    setOpis(projekat.opis ?? "");
                }
            } catch (error: unknown) {
                if (aktivnaKomponenta) setGreska(izvuciPorukuGreske(error, "Projekat nije učitan."));
            } finally {
                if (aktivnaKomponenta) setUcitavanje(false);
            }
        };

        void ucitajProjekat();

        return () => { aktivnaKomponenta = false; };
    }, [projekatId]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setGreska(null);
        setCuvanje(true);

        try {
            await izmijeniProjekat(projekatId, { naziv, opis });

            navigate(`/projekti/${projekatId}`);
        } catch (error: unknown) {
            setGreska(izvuciPorukuGreske(error, "Projekat nije izmenjen."));
        } finally {
            setCuvanje(false);
        }
    };

    if (ucitavanje) {
        return <Loading tekst="Učitavanje projekta..."/>
    }

    return (
        <div className="form-page">
            <div className="page-action">
                <div>
                    <p className="eyebrow">Izmena projekta</p>
                    <h2>Izmeni osnovne podatke</h2>
                    <p className="muted-text">Izmenu može izvršiti vlasnik projekta.</p>
                </div>
                <Link className="btn btn-secondary" to={`/projekti/${projekatId}`}>Nazad</Link>
            </div>

            <Card>
                <ErrorMessage poruka={greska}/>

                <form className="standard-form" onSubmit={handleSubmit}>
                    <Input
                        label="Naziv projekta"
                        name="naziv"
                        value={naziv}
                        onChange={(event) => setNaziv(event.target.value)}
                        required
                    />

                    <Textarea
                        label="Opis projekta"
                        name="opis"
                        value={opis}
                        onChange={(event) => setOpis(event.target.value)}
                    />

                    <div className="form-actions">
                        <Link className="btn btn-ghost" to={`/projekti/${projekatId}`}>Odustani</Link>
                        <Button type="submit" isLoading={cuvanje}>Sačuvaj</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};