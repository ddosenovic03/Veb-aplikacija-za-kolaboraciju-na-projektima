import { useState, type FormEvent } from "react";
import type { Prilog } from "../../types/prilog";
import { dodajFajlPrilog, dodajLinkPrilog, obrisiPrilog } from "../../api/prilogApi";
import { izvuciPorukuGreske } from "../../utils/errorHelper";
import { ErrorMessage } from "../common/ErrorMessage";
import { napraviUrlFajla } from "../../utils/urlHelper";
import { formatirajDatum } from "../../utils/dateFormat";
import { Button } from "../common/Button";
import { Input } from "../common/Input";

type PriloziKomentaraProps = {
    komentarId: number;
    prilozi: Prilog[];
    mozeDodati: boolean;
    mozeObrisati: boolean;
    onPromjena: () => Promise<void>;
};

export const PriloziKomentara = ({ komentarId, prilozi, mozeDodati, mozeObrisati, onPromjena }: PriloziKomentaraProps) => {

    const [url, setUrl] = useState("");
    const [fajl, setFajl] = useState<File | null>(null);
    const [ucitavanje, setUcitavanje] = useState(false);
    const [greska, setGreska] = useState<string | null>(null);

    const handleDodajLink = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setGreska(null);
        setUcitavanje(true);

        try {
            await dodajLinkPrilog(komentarId, { tip: "link", url });

            setUrl("");
            await onPromjena();
        } catch (error: unknown) {
            setGreska(izvuciPorukuGreske(error, "Link prilog nije dodat."));
        } finally {
            setUcitavanje(false);
        }
    };
    const handleDodajFajl = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget;

        if (!fajl) {
            setGreska("Izaberite fajl pre slanja.");
            return;
        }

        setGreska(null);
        setUcitavanje(true);

        try {
            await dodajFajlPrilog(komentarId, fajl);

            setFajl(null);
            form.reset();

            await onPromjena();
        } catch (error: unknown) {
            setGreska(izvuciPorukuGreske(error, "Fajl prilog nije dodat."));
        } finally {
            setUcitavanje(false);
        }
    };
    const handleObrisiPrilog = async (prilogId: number) => {
        const potvrda = window.confirm("Da li ste sigurni da želite da obrišete prilog?");
        if (!potvrda) return;

        setGreska(null);
        setUcitavanje(true);

        try {
            await obrisiPrilog(prilogId);
            await onPromjena();
        } catch (error: unknown) {
            setGreska(izvuciPorukuGreske(error, "Prilog nije obrisan."));
        } finally {
            setUcitavanje(false);
        }
    };

    return (
        <div className="attachments-section">
            <div className="attachments-header">
                <strong>Prilozi</strong>
                <span>{prilozi.length}</span>
            </div>

            <ErrorMessage poruka={greska}/>

            {prilozi.length === 0 ?
            (
                <p className="muted-text small-text">Nema priloga za ovaj komentar.</p>
            ) :
            (
                <div className="attachments-list">
                    {prilozi.map((prilog) => {
                        const jeLink = prilog.tip === "link";
                        const jeFajl = prilog.tip === "fajl";

                        return (
                            <article className="attachment-card" key={prilog.id}>
                                <div className="attachment-main">
                                    {jeLink && 
                                    (
                                        <>
                                        <span className="attachment-type">Link</span>
                                        {prilog.je_youtube && prilog.youtube_video_id ? 
                                        (
                                            <div className="youtube-preview">
                                                <iframe 
                                                    title={`Youtube prilog ${prilog.id}`}
                                                    src={`https://www.youtube-nocookie.com/embed/${prilog.youtube_video_id}`}
                                                    allowFullScreen
                                                />
                                            </div>
                                        ) : 
                                        (
                                            <a href={prilog.url_linka ?? "#"} target="_blank" rel="noreferrer">Otvori link</a>
                                        )}
                                        </>
                                    )}
                                    {jeFajl && 
                                    (
                                        <>
                                        <span className="attachment-type">Fajl</span>
                                        <a href={napraviUrlFajla(prilog.putanja_fajla)} target="_blank" rel="noreferrer">Otvori fajl</a>
                                        </>
                                    )}

                                    {prilog.datum_kreiranja && 
                                    (
                                        <p className="muted-text small-text">Dodato: {formatirajDatum(prilog.datum_kreiranja)}</p>
                                    )}
                                </div>

                                {mozeObrisati && 
                                (
                                    <Button variant="danger" onClick={() => void handleObrisiPrilog(prilog.id)} isLoading={ucitavanje}>Obriši</Button>
                                )}
                            </article>
                        );
                    })}
                </div>
            )}

            {mozeDodati && 
            (
                <div className="attachments-forms">
                    <form className="inline-form" onSubmit={handleDodajLink}>
                        <Input
                            label="Link prilog"
                            name="url"
                            type="url"
                            value={url}
                            onChange={(event) => setUrl(event.target.value)}
                            placeholder="https://..."
                            required
                        />

                        <Button type="submit" isLoading={ucitavanje}>Dodaj link</Button>
                    </form>

                    <form className="inline-form" onSubmit={handleDodajFajl}>
                        <div className="form-group">
                            <label htmlFor={`fajl-${komentarId}`}>Fajl prilog</label>
                            <input
                                id={`fajl-${komentarId}`}
                                className="form-control"
                                type="file"
                                onChange={(event) => setFajl(event.target.files?.[0] ?? null)}
                            />
                        </div>

                        <Button type="submit" isLoading={ucitavanje}>Dodaj fajl</Button>
                    </form>
                </div>
            )}
        </div>
    );
};