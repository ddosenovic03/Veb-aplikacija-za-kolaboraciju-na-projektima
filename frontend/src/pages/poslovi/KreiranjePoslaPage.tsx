import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { kreirajPosao } from "../../api/posaoApi";
import { izvuciPorukuGreske } from "../../utils/errorHelper";
import { Card } from "../../components/common/Card";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { Input } from "../../components/common/Input";
import { Textarea } from "../../components/common/Textarea";
import { Button } from "../../components/common/Button";

export const KreiranjePoslaPage = () => {

    const { projekatId: projekatIdParam } = useParams();
    const navigate = useNavigate();

    const projekatId = Number(projekatIdParam);

    const [naziv, setNaziv] = useState("");
    const [opis, setOpis] = useState("");
    const [rok, setRok] = useState("");
    const [ucitavanje, setUcitavanje] = useState(false);
    const [greska, setGreska] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!Number.isInteger(projekatId) || projekatId <= 0) {
            setGreska("ID projekta nije validan.");
            return;
        }

        setGreska(null);
        setUcitavanje(true);

        try {
            const posao = await kreirajPosao(projekatId, { naziv, opis, rok });
            
            navigate(`/poslovi/${posao.id}`);
        } catch (error: unknown) {
            setGreska(izvuciPorukuGreske(error, "Posao nije kreiran."));
        } finally {
            setUcitavanje(false);
        }
    };

    return (
        <div className="form-page">

            <div className="page-actions">
                <div>
                    <p className="eyebrow">Novi posao</p>
                    <h2>Kreiranje posla</h2>
                    <p className="muted-text">Kreiranjem posla automatski postajete angažovan član na tom poslu.</p>
                </div>
                <Link className="btn btn-secondary" to={`/projekti/${projekatId}`}>Nazad</Link>
            </div>

            <Card>
                <ErrorMessage poruka={greska}/>

                <form className="standard-form" onSubmit={handleSubmit}>
                    <Input
                        label="Naziv posla"
                        name="naziv"
                        value={naziv}
                        onChange={(event) => setNaziv(event.target.value)}
                        placeholder="Unesite naziv..."
                        required
                    />
                    <Textarea
                        label="Opis posla"
                        name="opis"
                        value={opis}
                        onChange={(event) => setOpis(event.target.value)}
                        placeholder="Unesite opis..."
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
                        <Link className="btn btn-ghost" to={`/projekti/${projekatId}`}>Odustani</Link>
                        <Button type="submit" isLoading={ucitavanje}>Sačuvaj</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};