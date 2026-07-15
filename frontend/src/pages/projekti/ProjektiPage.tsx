import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dobaviMojeProjekte } from "../../api/ProjekatApi";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { Loading } from "../../components/common/Loading";
import { ProgressBar } from "../../components/common/ProgressBar";
import type { Projekat } from "../../types/projekat";
import { izvuciPorukuGreske } from "../../utils/errorHelper";
import { formatirajStatus, odrediStatusVariant } from "../../utils/statusFormat";

export const ProjektiPage = () => {

    const [projekti, setProjekti] = useState<Projekat[]>([]);
    const [ucitavanje, setUcitavanje] = useState(true);
    const [greska, setGreska] = useState<string | null>(null);

    useEffect(() => {
        let aktivnaKomponenta = true;

        const ucitajProjekte = async () => {
            try {
                const podaci = await dobaviMojeProjekte();

                if (aktivnaKomponenta) setProjekti(podaci);
            } catch (error: unknown) {
                if (aktivnaKomponenta) setGreska(izvuciPorukuGreske(error, "Projekti nisu učitani."));
            } finally {
                if (aktivnaKomponenta) setUcitavanje(false);
            }
        };

        void ucitajProjekte();

        return () => { aktivnaKomponenta = false; };
    }, []);

    if (ucitavanje) return <Loading tekst="Učitavanje projekata..." />

    return (
        <div className="projects-page">
            <div className="page-actions">
                <div>
                    <p className="eyebrow">Projekti</p>
                    <h2>Moji projekti</h2>
                    <p className="muted-text">Pregled projekata u kojima ste prihvaćen član.</p>
                </div>

                <Link className="btn btn-primary" to="/projekti/novi">Novi projekat</Link>
            </div>

            <ErrorMessage poruka={greska} />

            { projekti.length === 0 ? 
                (
                    <section className="empty-state">
                        <h3>Nema podataka</h3>
                        <p>Još nemate projekat. Kreirajte novi projekat ili prihvatite poziv.</p>
                        <Button onClick={() => undefined}>
                            <Link className="button-link-reset" to="/projekti/novi">Kreirajte projekat</Link>
                        </Button>
                    </section>
                ) : 
                (
                    <div className="project-grid">
                        { projekti.map((projekat) => {

                            const procenat = projekat.procenat ?? 0;
                            const status = projekat.status ?? (procenat === 0 ? "nije_zapocet" : procenat === 100 ? "zavrsen" : "u_toku");    

                            return (
                                <article className="project-card" key={projekat.id}>
                                    
                                    <div className="project-card-header">
                                        <div>
                                            <h3>{projekat.naziv}</h3>
                                            <p>{projekat.opis || "Projekat nema opis."}</p>
                                        </div>

                                        <Badge variant={odrediStatusVariant(status)}>{formatirajStatus(status)}</Badge>
                                    </div>

                                    <div className="project-progress">
                                        <div className="progress-label-row">
                                            <span>Napredak</span>
                                            <strong>{procenat}%</strong>
                                        </div>
                                        <ProgressBar value={procenat} />
                                    </div>

                                    <div className="project-meta">
                                        <span>Članovi: {projekat.broj_clanova ?? 0}</span>
                                        <span>Poslovi: {projekat.broj_poslova ?? 0}</span>
                                    </div>

                                    <Link className="btn btn-secondary btn-full" to={`/projekti/${projekat.id}`}>Otvori projekat</Link>
                                </article>
                            );
                        }) 
                        };
                    </div>
                )
            };
        </div>
    );
};