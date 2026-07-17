import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { PosaoDetalji } from "../../types/Posao";
import type { Projekat } from "../../types/projekat";
import { azurirajProcenatPosla, dobaviDetaljePosla, obrisiPosao, prijaviSeNaPosao } from "../../api/posaoApi";
import { dobaviDetaljeProjekta } from "../../api/ProjekatApi";
import { izvuciPorukuGreske } from "../../utils/errorHelper";
import { Loading } from "../../components/common/Loading";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { dobaviAngazovane, dobaviKorisnikaIzAngazmana, dobaviKreatoraPosla, dobaviProcenatPosla, dobaviStatusPosla } from "../../utils/posaoHelper";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { formatirajStatus, odrediStatusVariant } from "../../utils/statusFormat";
import { formatirajDatum } from "../../utils/dateFormat";
import { formatirajKorisnika } from "../../utils/userFormat";
import { ProgressBar } from "../../components/common/ProgressBar";
import { Card } from "../../components/common/Card";
import { Input } from "../../components/common/Input";
import { KomentariSection } from "../../components/komentari/KomentariSection";

export const PosaoDetaljiPage = () => {

    const { posaoId: posaoIdParam } = useParams();
    const navigate = useNavigate();
    const { korisnik } = useAuth();

    const posaoId = Number(posaoIdParam);

    const [posao, setPosao] = useState<PosaoDetalji | null>(null);
    const [projekat, setProjekat] = useState<Projekat | null>(null);

    const [mojProcenat, setMojProcenat] = useState(0);
    const [predlozeniRok, setPredlozeniRok] = useState("");

    const [ucitavanje, setUcitavanje] = useState(true);
    const [akcijaUcitavanje, setAkcijaUcitavanje] = useState(false);
    const [brisanje, setBrisanje] = useState(false);
    const [greska, setGreska] = useState<string | null>(null);
    const [uspjeh, setUspjeh] = useState<string | null>(null);

    const ucitajPosao = useCallback(async () => {
        if (!Number.isInteger(posaoId) || posaoId <= 0) {
            setGreska("ID posla nije validan.");
            setUcitavanje(false);
            return;
        }

        setGreska(null);
        setUcitavanje(true);

        try {
            const detaljiPosla = await dobaviDetaljePosla(posaoId);
            setPosao(detaljiPosla);

            const mojProcenatIzBaze = detaljiPosla.moj_procenat;
            if (mojProcenatIzBaze !== undefined && mojProcenatIzBaze !== null) setMojProcenat(Number(mojProcenatIzBaze));

            const projekatId = detaljiPosla.projekat_id ?? detaljiPosla.projekat?.id;
            if (projekatId) {
                const detaljiProjekta = await dobaviDetaljeProjekta(projekatId);
                setProjekat(detaljiProjekta);
            }
        } catch (error: unknown) {
            setGreska(izvuciPorukuGreske(error, "Detalji posla nisu učitani."));
        } finally {
            setUcitavanje(false);
        }
    }, [posaoId]);

    useEffect(() => {
        void ucitajPosao();
    }, [ucitajPosao]);

    const handlePrijava = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setGreska(null);
        setUspjeh(null);
        setAkcijaUcitavanje(true);

        try {
            await prijaviSeNaPosao(posaoId, { predlozeni_rok: predlozeniRok || undefined });

            setUspjeh("Uspešno ste se prijavili na posao.");
            setPredlozeniRok("");
            
            await ucitajPosao();
        } catch (error: unknown) {
            setGreska(izvuciPorukuGreske(error, "Prijava na posao nije uspela."));
        } finally {
            setAkcijaUcitavanje(false);
        }
    };
    const handleAzuriranjeProcenta = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setGreska(null);
        setUspjeh(null);
        setAkcijaUcitavanje(true);

        try {
            await azurirajProcenatPosla(posaoId, { procenat: mojProcenat });

            setUspjeh("Procenat posla je uspešno ažuriran.");

            await ucitajPosao();
        } catch (error: unknown) {
            setGreska(izvuciPorukuGreske(error, "Procenat nije ažuriran."));
        } finally {
            setAkcijaUcitavanje(false);
        }
    };
    const handleBrisanje = async () => {
        const potvrda = window.confirm("Da li ste sigurni da želite da obrišete ovaj posao?");

        if (!potvrda) return;

        setGreska(null);
        setBrisanje(true);

        try {
            await obrisiPosao(posaoId);

            const projekatId = posao?.projekat_id ?? posao?.projekat?.id;

            if (projekatId) navigate(`/projekti/${projekatId}`, { replace: true });
            else navigate("/moji-poslovi", { replace: true });
        } catch (error: unknown) {
            setGreska(izvuciPorukuGreske(error, "Posao nije obrisan."));
        } finally {
            setBrisanje(false);
        }
    };

    if (ucitavanje) return <Loading tekst="Učitavanje detalja posla..."/>
    if (greska && !posao) return <ErrorMessage poruka={greska} />
    if (!posao) return <ErrorMessage poruka="Posao nije pronađen." />

    const procenatPosla = dobaviProcenatPosla(posao);
    const status = dobaviStatusPosla(posao);
    const kreator = dobaviKreatoraPosla(posao);
    const angazovani = dobaviAngazovane(posao);
    const korisnikJeAngazovan = posao.moj_procenat !== undefined || angazovani.some((angazman) => {
        const angazovaniKorisnik = dobaviKorisnikaIzAngazmana(angazman);
        return angazovaniKorisnik.id === korisnik?.id;
    });
    const korisnikJeKreator = (posao.kreator_id ?? posao.kreator?.id) === korisnik?.id;
    const korisnikJeVlasnikProjekta = (projekat?.vlasnik_id ?? projekat?.vlasnik?.id) === korisnik?.id;
    const mozeUpravljati = korisnikJeKreator || korisnikJeVlasnikProjekta;

    return (
        <div className="job-details-page">
            <div className="page-actions">
                <div>
                    <p className="eyebrow">Detalji posla</p>
                    <h2>{posao.naziv}</h2>
                    <p className="muted-text">Projekat:{" "}{posao.projekat?.naziv ?? projekat?.naziv ?? posao.projekat_naziv ?? "Nepoznat projekat"}</p>
                </div>
                <div className="button-row" >
                    {(posao.projekat_id ?? posao.projekat?.id) && (
                        <Link className="btn btn-secondary" to={`/projekti/${posao.projekat_id ?? posao.projekat?.id}`}>Nazad na projekat</Link>
                    )}
                    {mozeUpravljati && (
                        <>
                        <Link className="btn btn-secondary" to={`/poslovi/${posao.id}/izmena`}>Izmeni</Link>
                        <Button variant="danger" onClick={() => void handleBrisanje()} isLoading={brisanje}>Obriši</Button>
                        </>
                    )}
                </div>
            </div>

            <ErrorMessage poruka={greska}/>
            {uspjeh && <div className="success-message">{uspjeh}</div>}

            <section className="details-hero">
                <div>
                    <Badge variant={odrediStatusVariant(status)}>{formatirajStatus(status)}</Badge>
                    <p>{posao.opis || "Posao nema opis."}</p>
                    <div className="job-detail-meta">
                        <span>Rok: {formatirajDatum(posao.rok)}</span>
                        <span>Kreator: {formatirajKorisnika(kreator)}</span>
                        <span>Angažovani: {angazovani.length || posao.broj_angazovanih || 0}</span>
                    </div>
                </div>

                <div className="hero-progress-card">
                    <span>Napredak posla</span>
                    <strong>{procenatPosla}%</strong>
                    <ProgressBar value={procenatPosla}/>
                </div>
            </section>

            <div className="details-grid">
                <Card title="Angažovani korisnici">
                    {angazovani.length === 0 ? 
                    (
                        <p className="muted-text">Nema angažovanih korisnika za prikaz.</p>
                    ) :
                    (
                        <div className="mini-list">
                            {angazovani.map((angazman, index) => {
                                const angazovaniKorisnik = dobaviKorisnikaIzAngazmana(angazman);
                                const procenatAngazmana = Number(angazman.procenat ?? angazman.moj_procenat ?? 0);

                                return (
                                    <div className="mini-list-item" key={`${angazovaniKorisnik.id}-${index}`}>
                                        <div>
                                            <strong>{formatirajKorisnika(angazovaniKorisnik)}</strong>
                                            {angazman.predlozeni_rok && (
                                                <p className="muted-text small-text">Predloženi rok:{" "}{formatirajDatum(angazman.predlozeni_rok)}</p>
                                            )}
                                        </div>
                                        <Badge variant={odrediStatusVariant(
                                            procenatAngazmana === 0 ? "nije_zapocet" : procenatAngazmana === 100 ? "zavrsen" : "u_toku")}>
                                            {procenatAngazmana}%
                                        </Badge>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Card>

                <Card title={korisnikJeAngazovan ? "Ažuriranje procenta" : "Prijava na posao"}>
                    {korisnikJeAngazovan ? (
                        <form className="standard-form" onSubmit={handleAzuriranjeProcenta}>
                            <Input
                                label="Moj procenat rada"
                                name="procenat"
                                type="number"
                                min={0}
                                max={100}
                                value={mojProcenat}
                                onChange={(event) => setMojProcenat(Number(event.target.value))}
                                required
                            />
                            <Button type="submit" fullWidth isLoading={akcijaUcitavanje}>Sačuvaj</Button>
                        </form>
                    ) : (
                        <form className="standard-form" onSubmit={handlePrijava}>
                            <Input
                                label="Predloženi rok"
                                name="predlozeni_rok"
                                type="date"
                                value={predlozeniRok}
                                onChange={(event) => setPredlozeniRok(event.target.value)}
                            />
                            <Button type="submit" fullWidth isLoading={akcijaUcitavanje}>Prijavite se na posao</Button>
                        </form>
                    )}
                </Card>
            </div>

            <KomentariSection posaoId={posao.id} projekatVlasnikId={projekat?.vlasnik_id ?? projekat?.vlasnik?.id} />
        </div>
    );
};