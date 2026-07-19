import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../../context/AuthContext";
import type { Komentar, VidljivostKomentara } from "../../types/komentar";
import { dobaviKomentareZaPosao, dodajKomentar, izmijeniKomentar, obrisiKomentar } from "../../api/komentarApi";
import { izvuciPorukuGreske } from "../../utils/errorHelper";
import { Loading } from "../common/Loading";
import { Card } from "../common/Card";
import { ErrorMessage } from "../common/ErrorMessage";
import { Textarea } from "../common/Textarea";
import { Button } from "../common/Button";
import { dobaviAutoraKomentara } from "../../utils/komentarHelper";
import { formatirajKorisnika } from "../../utils/userFormat";
import { formatirajDatum } from "../../utils/dateFormat";
import { Badge } from "../common/Badge";
import type { Prilog } from "../../types/prilog";
import { dobaviPrilogeZaKomentar } from "../../api/prilogApi";
import { PriloziKomentara } from "./PriloziKomentara";

type KomentariSectionProps = {
    posaoId: number;
    projekatVlasnikId?: number;
};

export const KomentariSection = ({ posaoId, projekatVlasnikId }: KomentariSectionProps) => {

    const { korisnik } = useAuth();

    const [komentari, setKomentari] = useState<Komentar[]>([]);
    const [priloziKomentara, setPriloziKomentara] = useState<Record<number, Prilog[]>>({});

    const [noviSadrzaj, setNoviSadrzaj] = useState("");
    const [novaVidljivost, setNovaVidljivost] = useState<VidljivostKomentara>("javni");

    const [komentarZaIzmjenuId, setKomentarZaIzmjenuId] = useState<number | null>(null);
    const [izmjenaSadrzaj, setIzmjenaSadrzaj] = useState("");
    const [izmjenaVidljivost, setIzmjenaVidljivost] = useState<VidljivostKomentara>("javni");

    const [ucitavanje, setUcitavanje] = useState(true);
    const [akcijaUcitavanje, setAkcijaUcitavanje] = useState(false);
    const [greska, setGreska] = useState<string | null>(null);
    const [uspjeh, setUspjeh] = useState<string | null>(null);

    const ucitajPrilogeKomentara = useCallback(async (listaKomentara: Komentar[]) => {
        const parovi = await Promise.all(listaKomentara.map(async (komentar) => {
            const prilozi = await dobaviPrilogeZaKomentar(komentar.id);
            return [komentar.id, prilozi] as const;
        }));

        setPriloziKomentara(Object.fromEntries(parovi));
    }, []);
    const ucitajKomentare = useCallback(async () => {
        setGreska(null);

        try {
            const podaci = await dobaviKomentareZaPosao(posaoId);
            setKomentari(podaci);
            await ucitajPrilogeKomentara(podaci);
        } catch (error: unknown) {
            setGreska(izvuciPorukuGreske(error, "Komentari nisu učitani."));
        }
    }, [posaoId]);
    const osvjeziPrilogeKomentara = async (komentarId: number) => {
        const prilozi = await dobaviPrilogeZaKomentar(komentarId);

        setPriloziKomentara((prethodni) => ({ ...prethodni, [komentarId]: prilozi }));
    };

    useEffect(() => {
        let aktivnaKomponenta = true;

        const ucitaj = async () => {
            setUcitavanje(true);

            try {
                const podaci = await dobaviKomentareZaPosao(posaoId);

                if (aktivnaKomponenta) {
                    setKomentari(podaci);
                    await ucitajPrilogeKomentara(podaci);
                }
            } catch (error: unknown) {
                if (aktivnaKomponenta) setGreska(izvuciPorukuGreske(error, "Komentari nisu učitani."));
            } finally {
                if (aktivnaKomponenta) setUcitavanje(false);
            }
        };

        void ucitaj();

        return () => { aktivnaKomponenta = false; };
    }, [posaoId, ucitajPrilogeKomentara]);

    const handleDodajKomentar = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setGreska(null);
        setUspjeh(null);
        setAkcijaUcitavanje(true);

        try {
            await dodajKomentar(posaoId, { sadrzaj: noviSadrzaj, vidljivost: novaVidljivost });

            setNoviSadrzaj("");
            setNovaVidljivost("javni");
            setUspjeh("Komentar je uspešno dodat.");

            await ucitajKomentare();
        } catch (error: unknown) {
            setGreska(izvuciPorukuGreske(error, "Komentar nije dodat."));
        } finally {
            setAkcijaUcitavanje(false);
        }
    };
    const zapocniIzmjenuKomentara = (komentar: Komentar) => {
        setKomentarZaIzmjenuId(komentar.id);
        setIzmjenaSadrzaj(komentar.sadrzaj);
        setIzmjenaVidljivost(komentar.vidljivost);
        setGreska(null);
        setUspjeh(null);
    };
    const odustaniOdIzmjene = () => {
        setKomentarZaIzmjenuId(null);
        setIzmjenaSadrzaj("");
        setIzmjenaVidljivost("javni");
    };  
    const handleIzmijeniKomentar = async (event: FormEvent<HTMLFormElement>, komentarId: number) => {
        event.preventDefault();

        setGreska(null);
        setUspjeh(null);
        setAkcijaUcitavanje(true);

        try {
            await izmijeniKomentar(komentarId, { sadrzaj: izmjenaSadrzaj, vidljivost: izmjenaVidljivost });

            setUspjeh("Komentar je uspešno izmenjen.");
            odustaniOdIzmjene();

            await ucitajKomentare();
        } catch (error: unknown) {
            setGreska(izvuciPorukuGreske(error, "Komentar nije izmenjen."));
        } finally {
            setAkcijaUcitavanje(false);
        }
    };
    const handleObrisiKomentar = async (komentarId: number) => {
        const potvrda = window.confirm("Da li ste sigurni da želite da obrišete ovaj komentar?");

        if (!potvrda) return;

        setGreska(null);
        setUspjeh(null);
        setAkcijaUcitavanje(true);

        try {
            await obrisiKomentar(komentarId);

            setUspjeh("Komentar uspešno obrisan.");
            await ucitajKomentare(); 
        } catch (error: unknown) {
            setGreska(izvuciPorukuGreske(error, "Komentar nije obrisan."));
        } finally {
            setAkcijaUcitavanje(false);
        }
    };

    if (ucitavanje) return <Loading tekst="Učitavanje komentara..."/>

    return (
        <Card title="Komentar">
            <ErrorMessage poruka={greska}/>
            {uspjeh && <div className="success-message">{uspjeh}</div>}

            <form className="comment-form" onSubmit={handleDodajKomentar}>
                <Textarea 
                    label="Novi komentar"
                    name="sadrzaj"
                    value={noviSadrzaj}
                    onChange={(event) => setNoviSadrzaj(event.target.value)}
                    placeholder="Sadržaj..."
                    required
                />

                <div className="form-row">  
                    <div className="form-group">
                        <label htmlFor="vidljivost">Vidljivost</label>
                        <select id="vidljivost" className="form-control" value={novaVidljivost} 
                            onChange={(event) => setNovaVidljivost(event.target.value as VidljivostKomentara)}>
                            <option value="javni">Javni komentar</option>
                            <option value="privatni">Privatni komentar</option>
                        </select>
                    </div>
                    <Button type="submit" isLoading={akcijaUcitavanje}>Dodaj komentar</Button>
                </div>
            </form>

            <div className="comments-list">
                {komentari.length === 0 ?
                (
                    <section className="empty-state compact empty">
                        <h3>Nema komentara</h3>
                        <p>Još nema komentara za ovaj posao.</p>
                    </section>
                ) :
                (
                    komentari.map((komentar) => {
                        const autor = dobaviAutoraKomentara(komentar);
                        const autorId = autor?.id ?? komentar.autor_id;
                        
                        const korisnikJeAutor = autorId === korisnik?.id;
                        const korisnikJeVlasnikProjekta = projekatVlasnikId === korisnik?.id;

                        const mozeIzmijeniti = korisnikJeAutor;
                        const mozeObrisati = korisnikJeAutor || korisnikJeVlasnikProjekta;

                        const komentarJeUFormiZaIzmjenu = komentarZaIzmjenuId === komentar.id;

                        return (
                            <article className="comment-card" key={komentar.id}>
                                <div className="comment-header">
                                    <div>
                                        <strong>{formatirajKorisnika(autor)}</strong>
                                        {komentar.datum_kreiranja && (
                                            <p className="muted-text small-text">{formatirajDatum(komentar.datum_kreiranja)}</p>
                                        )}
                                    </div>
                                    <Badge variant={komentar.vidljivost === "privatni" ? "warning" : "default"}>
                                        {komentar.vidljivost === "privatni" ? "Privatni" : "Javni"}
                                    </Badge>
                                </div>

                                {komentarJeUFormiZaIzmjenu ? 
                                (
                                    <form className="comment-form" onSubmit={(event) => void handleIzmijeniKomentar(event, komentar.id)}>
                                        <Textarea 
                                            label="Izmena komentara"
                                            name="izmjena_sadrzaja"
                                            value={izmjenaSadrzaj}
                                            onChange={(event) => setIzmjenaSadrzaj(event.target.value)}
                                            required
                                        />

                                        <div className="form-row">  
                                            <div className="form-group">
                                                <label htmlFor={`vidljivost-${komentar.id}`}>Vidljivost</label>
                                                <select id={`vidljivost-${komentar.id}`} className="form-control" value={izmjenaVidljivost} 
                                                    onChange={(event) => setIzmjenaVidljivost(event.target.value as VidljivostKomentara)}>
                                                    <option value="javni">Javni komentar</option>
                                                    <option value="privatni">Privatni komentar</option>
                                                </select>
                                            </div>
                                            <div className="button-row align-end">
                                                <Button type="button" variant="ghost" onClick={odustaniOdIzmjene}>Odustani</Button>
                                            </div>
                                            <Button type="submit" isLoading={akcijaUcitavanje}>Sačuvaj</Button>
                                        </div>
                                    </form>
                                ) :
                                (
                                    <p className="comment-content">{komentar.sadrzaj}</p>
                                )}

                                {!komentarJeUFormiZaIzmjenu && (mozeIzmijeniti || mozeObrisati) &&
                                (
                                    <div className="comment-actions">
                                        {mozeIzmijeniti &&
                                        (
                                            <Button variant="secondary" onClick={() => zapocniIzmjenuKomentara(komentar)}>Izmeni</Button>
                                        )}
                                        {mozeObrisati &&
                                        (
                                            <Button variant="danger" onClick={() => handleObrisiKomentar(komentar.id)} isLoading={akcijaUcitavanje}>
                                                Obriši
                                            </Button>
                                        )}
                                    </div>
                                )}

                                <PriloziKomentara 
                                    komentarId={komentar.id}
                                    prilozi={priloziKomentara[komentar.id] ?? []}
                                    mozeDodati={korisnikJeAutor}
                                    mozeObrisati={korisnikJeAutor || korisnikJeVlasnikProjekta}
                                    onPromjena={() => osvjeziPrilogeKomentara(komentar.id)}
                                />
                            </article>
                        );
                    })
                )}
            </div>
        </Card>
    );
};