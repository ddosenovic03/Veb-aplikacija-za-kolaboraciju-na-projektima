import { Link } from "react-router-dom";
import type { PosaoZaListu } from "../../types/posao"
import { formatirajDatum } from "../../utils/dateFormat";
import { dobaviKreatoraPosla, dobaviProcenatPosla, dobaviStatusPosla } from "../../utils/posaoHelper";
import { formatirajStatus, odrediStatusVariant } from "../../utils/statusFormat";
import { formatirajKorisnika } from "../../utils/userFormat";
import { Badge } from "../common/Badge";
import { ProgressBar } from "../common/ProgressBar";

type PosaoCardProps = {
    posao: PosaoZaListu;
    prikaziProjekat?: boolean;
    prikaziMojProcenat?: boolean;
};

export const PosaoCard = ({ posao, prikaziProjekat = false, prikaziMojProcenat = false }: PosaoCardProps) => {

    const procenat = dobaviProcenatPosla(posao);
    const status = dobaviStatusPosla(posao);
    const kreator = dobaviKreatoraPosla(posao);

    return (
        <article className="job-card">

            <div className="job-card-header">
                <div>
                    <h3>{posao.naziv}</h3>
                    <p>{posao.opis || "Posao nema opis."}</p>
                </div>
                <Badge variant={odrediStatusVariant(status)}>{formatirajStatus(status)}</Badge>
            </div>

            <div className="job-meta">
                {prikaziProjekat && (<span>Projekat: {posao.projekat?.naziv ?? posao.projekat_naziv ?? "Nepoznat"}</span>)}
                <span>Rok: {formatirajDatum(posao.rok)}</span>
                <span>Kreator: {formatirajKorisnika(kreator)}</span>
                <span>Angažovani: {posao.broj_angazovanih ?? 0}</span>
            </div>

            <div className="job-progress">
                <div className="progress-label-row">
                    <span>Napredak posla</span>
                    <strong>{procenat}%</strong>
                </div>
                <ProgressBar value={procenat}/>
            </div>

            {prikaziMojProcenat && posao.moj_procenat !== undefined && (
                <p className="muted-text small-text">Moj procenat: <strong>{posao.moj_procenat}%</strong></p>
            )}

            <Link className="btn btn-secondary btn-full" to={`/poslovi/${posao.id}`}>Otvori posao</Link>
        </article>
    );
};