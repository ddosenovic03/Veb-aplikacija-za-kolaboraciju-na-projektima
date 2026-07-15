import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { ClanProjekta, NapredakProjekta, PozivZaProjekat, Projekat } from "../../types/projekat";
import type { PosaoZaListu } from "../../types/Posao";
import { dobaviClanoveProjekta, dobaviDetaljeProjekta, dobaviNapredakProjekta, dobaviPosloveZaProjekat, dobaviPoziveZaProjekat, obrisiProjekat, pozoviKorisnikaNaProjekat } from "../../api/ProjekatApi";
import { izvuciPorukuGreske } from "../../utils/errorHelper";
import { Loading } from "../../components/common/Loading";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { formatirajClana, formatirajKorisnika, formatirajPozvanogKorisnika } from "../../utils/userFormat";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { formatirajStatus, odrediStatusVariant } from "../../utils/statusFormat";
import { formatirajDatum } from "../../utils/dateFormat";
import { ProgressBar } from "../../components/common/ProgressBar";
import { Card } from "../../components/common/Card";
import { Input } from "../../components/common/Input";
import { useAuth } from "../../context/AuthContext";

export const ProjekatDetaljiPage = () => {

    const { projekatId: projekatIdParam } = useParams();
    const navigate = useNavigate();

    const projekatId = Number(projekatIdParam);

    const { korisnik } = useAuth();

    const [projekat, setProjekat] = useState<Projekat | null>(null);
    const [napredak, setNapredak] = useState<NapredakProjekta | null>(null);
    const [clanovi, setClanovi] = useState<ClanProjekta[]>([]);
    const [pozivi, setPozivi] = useState<PozivZaProjekat[]>([]);
    const [poslovi, setPoslovi] = useState<PosaoZaListu[]>([]);

    const [email, setEmail] = useState("");
    const [ucitavanje, setUcitavanje] = useState(true);
    const [pozivanje, setPozivanje] = useState(false);
    const [brisanje, setBrisanje] = useState(false);
    const [greska, setGreska] = useState<string | null>(null);
    const [uspjeh, setUspjeh] = useState<string | null>(null); 

    const ucitajDetalje = useCallback(async () => {
        if (!Number.isInteger(projekatId) || projekatId <= 0) {
            setGreska("ID projekta nije validan.");
            setUcitavanje(false);
            return;
        }

        setGreska(null);
        setUcitavanje(true);

        try {
            const detaljiProjekta = await dobaviDetaljeProjekta(projekatId);
            const vlasnikId = detaljiProjekta.vlasnik_id ?? detaljiProjekta.vlasnik?.id;
            const korisnikJeVlasnik = vlasnikId === korisnik?.id;
            const [podaciONapretku, clanoviProjekta, posloviProjekta] = await Promise.all([
                dobaviNapredakProjekta(projekatId),
                dobaviClanoveProjekta(projekatId),
                dobaviPosloveZaProjekat(projekatId)
            ]);
            const poziviProjekta = korisnikJeVlasnik ? await dobaviPoziveZaProjekat(projekatId) : [];

            setProjekat(detaljiProjekta);
            setNapredak(podaciONapretku);
            setClanovi(clanoviProjekta);
            setPozivi(poziviProjekta);
            setPoslovi(posloviProjekta);
        } catch (error: unknown) {
            setGreska(izvuciPorukuGreske(error, "Detalji projekta nisu učitani."));
        } finally {
            setUcitavanje(false);
        }
    }, [projekatId, korisnik?.id]);

    useEffect(() => {
        void ucitajDetalje();
    }, [ucitajDetalje])

    const handlePozovi = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setGreska(null);
        setUspjeh(null);
        setPozivanje(true);

        try {
            await pozoviKorisnikaNaProjekat(projekatId, { email });

            const osvjezeniPozivi = await dobaviPoziveZaProjekat(projekatId);
            setPozivi(osvjezeniPozivi);
            setEmail("");
            setUspjeh("Poziv je uspešno poslan.");
        } catch (error: unknown) {
            setGreska(izvuciPorukuGreske(error, "Poziv nije poslan."));
        } finally {
            setPozivanje(false);
        }
    };
    const handleObrisiProjekat = async () => {
        const potvrda = window.confirm("Da li ste sigurni da želite da obrišete ovaj projekat?");

        if (!potvrda) return;

        setGreska(null);
        setBrisanje(true);

        try {
            await obrisiProjekat(projekatId);
            navigate("/projekti", { replace: true });
        } catch (error: unknown) {
            setGreska(izvuciPorukuGreske(error, "Projekat nije obrisan."));
        } finally {
            setBrisanje(false);
        }
    };

    if (ucitavanje) return <Loading tekst="Učitavanje detalja projekta..." />
    if (greska && !projekat) return <ErrorMessage poruka={greska} />
    if (!projekat) return <ErrorMessage poruka="Projekat nije pronađen." />

    const procenat = napredak?.procenat ?? projekat.procenat ?? 0;
    const status = napredak?.status ?? projekat.status ?? (procenat === 0 ? "nije_zapocet" : procenat === 100 ? "zavrsen" : "u_toku");
    const vlasnik = projekat.vlasnik ?? { 
        id: projekat.vlasnik_id, 
        ime: projekat.vlasnik_ime, 
        prezime: projekat.vlasnik_prezime, 
        korisnicko_ime: projekat.vlasnik_korisnicko_ime 
    };
    const jeVlasnik = (projekat.vlasnik_id ?? projekat.vlasnik?.id) === korisnik?.id;

    return (
        <div className="project-details-page">
            <div className="page-actions">
                <div>
                    <p className="eyebrow">Detalji projekta</p>
                    <h2>{projekat.naziv}</h2>
                    <p className="muted-text">Vlasnik: {formatirajKorisnika(vlasnik)}</p>
                </div>
                <div className="button-row">
                    <Link className="btn btn-secondary" to="/projekti">Nazad</Link>
                    <Link className="btn btn-primary" to={`/projekti/${projekatId}/poslovi/novi`}>Novi posao</Link>
                    {jeVlasnik && (
                        <>
                            <Link className="btn btn-secondary" to={`/projekti/${projekat.id}/izmena`}>Izmeni</Link>
                            <Button variant="danger" onClick={() => void handleObrisiProjekat()} isLoading={brisanje}>Obriši</Button>
                        </>
                    )}
                </div>
            </div>

            <ErrorMessage poruka={greska} />
            {uspjeh && <div className="success-message">{uspjeh}</div>}

            <section className="details-hero">
                <div>
                    <Badge variant={odrediStatusVariant(status)}>{formatirajStatus(status)}</Badge>
                    <p>{projekat.opis || "Projekat nema opis."}</p>
                    {projekat.datum_kreiranja && (<p className="muted-text small-text">Kreiran: {formatirajDatum(projekat.datum_kreiranja)}</p>)}
                </div>
                <div className="hero-progress-card">
                    <span>Napredak projekta</span>
                    <strong>{procenat}%</strong>
                    <ProgressBar value={procenat}/>
                </div>
            </section>

            <div className="details-grid">
                <Card title="Članovi projekta">
                    {clanovi.length === 0 ? (<p className="muted-text">Nema članova za prikaz.</p>) :
                    (
                        <div className="mini-list">
                            {clanovi.map((clan, index) => (
                                <div className="mini-list-item" key={`${clan.korisnik_id}-${index}`}>
                                    <span>{formatirajClana(clan)}</span>
                                    <Badge variant={clan.uloga === "vlasnik" ? "success" : "default"}>
                                        {formatirajStatus(clan.uloga ?? clan.status ?? "clan")}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {jeVlasnik && (
                    <Card title="Pozovi korisnika">
                        <form className="invite-form" onSubmit={handlePozovi}>
                            <Input 
                                label="Email korisnika"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="korisnik@example.com"
                                required
                            />
                            <Button type="submit" fullWidth isLoading={pozivanje}>Pošalji poziv</Button>
                        </form>
                    </Card>
                )}
            </div>

            {jeVlasnik && (
                <Card title="Pozvani korisnici">
                    {pozivi.length === 0 ? (<p className="muted-text">Nema aktivnih poziva za ovaj projekat.</p>) :
                    (
                        <div className="mini-list">
                            {pozivi.map((poziv, index) => (
                                <div className="mini-list-item" key={`${poziv.korisnik_id}-${index}`}>
                                    <span>{formatirajPozvanogKorisnika(poziv)}</span>
                                    <Badge variant={odrediStatusVariant(poziv.status)}>
                                        {formatirajStatus(poziv.status)}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            )}

            <Card title="Poslovi na projektu">
                {poslovi.length === 0 ? 
                (
                    <section className="empty-state compact-empty">
                        <h3>Nema poslova</h3>
                        <p>Unutar projekta trenutno nema poslova.</p>
                        <Link className="btn btn-primary" to={`/projekti/${projekatId}/poslovi/novi`}>Kreiraj posao</Link>
                    </section>
                ) :
                (
                    <div className="tasks-list">
                        {poslovi.map((posao) => {
                            const procenatPosla = posao.procenat_posla ?? posao.procenat ?? 0;
                            const statusPosla = posao.status ?? (procenatPosla === 0 ? "nije_zapocet" : procenatPosla === 100 ? "zavrsen" : "u_toku");
                            
                            return (
                                <article className="task-row" key={posao.id}>
                                    <div>
                                        <h3>{posao.naziv}</h3>
                                        <p>{posao.opis || "Posao nema opis."}</p>
                                        <div className="task-meta">
                                            {posao.rok && <span>Rok: {formatirajDatum(posao.rok)}</span>}
                                            <span>Angažovani: {posao.broj_angazovanih ?? 0}</span>
                                        </div>
                                    </div>

                                    <div className="task-progress">
                                        <Badge variant={odrediStatusVariant(statusPosla)}>
                                            {formatirajStatus(statusPosla)}
                                        </Badge>
                                        <strong>{procenatPosla}%</strong>
                                        <ProgressBar value={procenatPosla}/>
                                        <Link className="btn btn-secondary" to={`/poslovi/${posao.id}`}>Otvori</Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </Card>
        </div>
    );

};