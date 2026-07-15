import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { dobaviDetaljePosla, izmijeniPosao } from "../../api/posaoApi";
import { formatirajDatumZaInput } from "../../utils/dateFormat";
import { izvuciPorukuGreske } from "../../utils/errorHelper";
import { Loading } from "../../components/common/Loading";
import { Card } from "../../components/common/Card";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { Input } from "../../components/common/Input";
import { Textarea } from "../../components/common/Textarea";
import { Button } from "../../components/common/Button";

export const IzmjenaPoslaPage = () => {

    const { posaoId: posaoIdParam } = useParams();
    const navigate = useNavigate();

    const posaoId = Number(posaoIdParam);

    const [naziv, setNaziv] = useState("");
    const [opis, setOpis] = useState("");
    const [rok, setRok] = useState("");

    const [ucitavanje, setUcitavanje] = useState(true);
    const [cuvanje, setCuvanje] = useState(false);
    const [greska, setGreska] = useState<string | null>(null);

    useEffect(() => {
        let aktivnaKomponenta = true;

        const ucitajPosao = async () => {
            if (!Number.isInteger(posaoId) || posaoId <= 0) {
                setGreska("ID posla nije validan.");
                setUcitavanje(false);
                return;
            }
            try {
                const posao = await dobaviDetaljePosla(posaoId);

                if (aktivnaKomponenta) {
                    setNaziv(posao.naziv);
                    setOpis(posao.opis ?? "");
                    setRok(formatirajDatumZaInput(posao.rok));
                } 
            } catch (error: unknown) {
                if (aktivnaKomponenta) setGreska(izvuciPorukuGreske(error, "Posao nije učitan."));
            } finally {
                if (aktivnaKomponenta) setUcitavanje(false);
            }
        };

        void ucitajPosao();

        return () => { aktivnaKomponenta = false; };
    }, [posaoId]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setGreska(null);
        setCuvanje(true);

        try {
            await izmijeniPosao(posaoId, { naziv, opis, rok });

            navigate(`/poslovi/${posaoId}`);
        } catch (error: unknown) {
            setGreska(izvuciPorukuGreske(error, "Posao nije izmenjen."));
        } finally {
            setCuvanje(false);
        }
    };
    
    if (ucitavanje) return <Loading tekst="Učitavanje posla..."/>

    return (
        <div className="form-page">
            <div className="page-actions">
                <div>
                    <p className="eyebrow">Izmena posla</p>
                    <h2>Izmenite osnovne podatke posla</h2>
                    <p className="muted-text">Izmenu može izvršiti kreator posla ili vlasnik projekta.</p>
                </div>
                <Link className="btn btn-secondary" to={`/poslovi/${posaoId}`}>Nazad</Link>
            </div>

            <Card>
                <ErrorMessage poruka={greska}/>
                <form className="standard-form" onSubmit={handleSubmit}>
                    <Input
                        label="Naziv posla"
                        name="naziv"
                        value={naziv}
                        onChange={(event) => setNaziv(event.target.value)}
                        required
                    />
                    <Textarea
                        label="Opis posla"
                        name="opis"
                        value={opis}
                        onChange={(event) => setOpis(event.target.value)}
                    />
                    <Input
                        label="Rok"
                        name="rok"
                        type="date"
                        value={rok}
                        onChange={(event) => setRok(event.target.value)}
                        required
                    />
                    <div className="form-actions">
                        <Link className="btn btn-ghost" to={`/poslovi/${posaoId}`}>Odustani</Link>
                        <Button type="submit" isLoading={cuvanje}>Sačuvaj</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};