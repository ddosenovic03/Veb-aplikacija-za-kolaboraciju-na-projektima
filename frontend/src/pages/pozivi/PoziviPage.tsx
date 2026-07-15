import { useEffect, useState } from "react";
import type { PozivKorisnika } from "../../types/projekat";
import { dobaviPoziveKorisnika, odbijPoziv, prihvatiPoziv } from "../../api/ProjekatApi";
import { izvuciPorukuGreske } from "../../utils/errorHelper";
import { Loading } from "../../components/common/Loading";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { formatirajKorisnika } from "../../utils/userFormat";
import { Badge } from "../../components/common/Badge";
import { formatirajStatus, odrediStatusVariant } from "../../utils/statusFormat";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/common/Button";

const dobaviProjekatIdIzPoziva = (poziv: PozivKorisnika) => {

    return poziv.projekat?.id ?? poziv.projekat_id ?? poziv.id;
};

const dobaviNazivProjektaIzPoziva = (poziv: PozivKorisnika) => {

    return poziv.projekat?.naziv ?? poziv.projekat_naziv ?? poziv.naziv ?? "Projekat";
};

const dobaviOpisProjektaIzPoziva = (poziv: PozivKorisnika) => {

    return poziv.projekat?.opis ?? poziv.projekat_opis ?? poziv.opis ?? "";
};

export const PoziviPage = () => {

    const navigate = useNavigate();

    const [pozivi, setPozivi] = useState<PozivKorisnika[]>([]);
    const [ucitavanje, setUcitavanje] = useState(true);
    const [akcijaUcitavanje, setAkcijaUcitavanje] = useState<number | null>(null);
    const [greska, setGreska] = useState<string | null>(null);

    const ucitajPozive = async () => {
        const podaci = await dobaviPoziveKorisnika();
        setPozivi(podaci);
    };

    useEffect(() => {
        let aktivnaKomponenta = true;

        const ucitaj = async () => {
            try {
                const podaci = await dobaviPoziveKorisnika();
                if (aktivnaKomponenta) setPozivi(podaci);
            } catch (error: unknown) {
                if (aktivnaKomponenta) setGreska(izvuciPorukuGreske(error, "Pozivi nisu učitani."));
            } finally {
                if (aktivnaKomponenta) setUcitavanje(false);
            }
        };

        void ucitaj();

        return () => {
            aktivnaKomponenta = false;
        };
    }, []);

    const handlePrihvati = async (poziv: PozivKorisnika) => {
        const projekatId = dobaviProjekatIdIzPoziva(poziv);

        if (!projekatId) {
            setGreska("ID projekta nije pronađen u pozivu.");
            return;
        }

        setGreska(null);
        setAkcijaUcitavanje(projekatId);

        try {
            await prihvatiPoziv(projekatId);
            
            navigate(`/projekti/${projekatId}`);
        } catch (error: unknown) {
            setGreska(izvuciPorukuGreske(error, "Poziv nije prihvaćen."));
        } finally {
            setAkcijaUcitavanje(null);
        }
    };
    const handleOdbij = async (poziv: PozivKorisnika) => {
        const projekatId = dobaviProjekatIdIzPoziva(poziv);

        if (!projekatId) {
            setGreska("ID projekta nije pronađen u pozivu.");
            return;
        }

        setGreska(null);
        setAkcijaUcitavanje(projekatId);

        try {
            await odbijPoziv(projekatId);
            await ucitajPozive();
        } catch (error: unknown) {
            setGreska(izvuciPorukuGreske(error, "Poziv nije odbijen."));
        } finally {
            setAkcijaUcitavanje(null);
        }
    }

    if (ucitavanje) return <Loading tekst="Učitavanje poziva..." />;

    return (
        <div className="invites-page">
            <div className="page-actions">
                <div>
                    <p className="eyebrow">Pozivi</p>
                    <h2>Pozivi za projekte</h2>
                    <p className="muted-text">Ovde možete prihvatiti ili odbiti pozive za članstvo na projektima.</p>
                </div>
            </div>

            <ErrorMessage poruka={greska} />

            { pozivi.length === 0 ?
                (
                    <section className="empty-state">
                        <h3>Nema novih poziva</h3>
                        <p>Trenutno nemate pozive koji čekaju odgovor.</p>
                    </section>
                ) :
                (
                    <div className="list-stack">
                        { pozivi.map((poziv) => {
                            const projekatId = dobaviProjekatIdIzPoziva(poziv);
                            const naziv = dobaviNazivProjektaIzPoziva(poziv);
                            const opis = dobaviOpisProjektaIzPoziva(poziv);
                            const ucitavaSe = projekatId === akcijaUcitavanje;

                            return (
                                <article className="list-card" key={`${projekatId}-${naziv}`}>
                                    <div className="list-card-main">
                                        <div>
                                            <h3>{naziv}</h3>
                                            <p>{opis || "Projekat nema opis."}</p>
                                            <p className="muted-text small-text">Vlasnik: {formatirajKorisnika(poziv.vlasnik)}</p>
                                        </div>

                                        <Badge variant={odrediStatusVariant(poziv.status)}>{formatirajStatus(poziv.status)}</Badge>
                                    </div>

                                    <div className="list-card-actions">
                                        <Button variant="secondary" onClick={() => void handleOdbij(poziv)} isLoading={ucitavaSe}>Odbij</Button>
                                        <Button onClick={() => void handlePrihvati(poziv)} isLoading={ucitavaSe}>Prihvati</Button>
                                    </div>
                                </article>
                            );
                        })
                        }
                    </div>
                )
            }
        </div>
    );
};