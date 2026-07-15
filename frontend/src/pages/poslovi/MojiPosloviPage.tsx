import { useEffect, useState } from "react";
import type { PosaoZaListu } from "../../types/Posao";
import { dobaviMojePoslove } from "../../api/posaoApi";
import { izvuciPorukuGreske } from "../../utils/errorHelper";
import { Loading } from "../../components/common/Loading";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { PosaoCard } from "../../components/poslovi/PosaoCard";

export const MojiPosloviPage = () => {

    const [poslovi, setPoslovi] = useState<PosaoZaListu[]>([]);
    const [ucitavanje, setUcitavanje] = useState(true);
    const [greska, setGreska] = useState<string | null>(null);

    useEffect(() => {
        let aktivnaKomponenta = true;

        const ucitajPoslove = async () => {
            try {
                const podaci = await dobaviMojePoslove();
                
                if (aktivnaKomponenta) setPoslovi(podaci);
            } catch (error: unknown) {
                if (aktivnaKomponenta) setGreska(izvuciPorukuGreske(error, "Moji poslovi nisu učitani."));
            } finally {
                if (aktivnaKomponenta) setUcitavanje(false);
            }
        };

        void ucitajPoslove();

        return () => { aktivnaKomponenta = true; };
    }, []);

    if (ucitavanje) return <Loading tekst="Učitavanje mojih poslova..."/>

    return (
        <div className="jobs-page">

            <div className="page-actions">
                <div>
                    <p className="eyebrow">Poslovi</p>
                    <h2>Moji poslovi</h2>
                    <p className="muted-text">Poslovi na kojima ste trenutno angažovani.</p>
                </div>
            </div>

            <ErrorMessage poruka={greska}/>

            {poslovi.length === 0 ? 
            (
                <section className="empty-state">
                    <h3>Nema poslova</h3>
                    <p>Još niste angažovani ni na jednom poslu.</p>
                </section>
            ) :
            (
                <div className="job-grid">
                    {poslovi.map((posao) => ( <PosaoCard key={posao.id} posao={posao} prikaziProjekat prikaziMojProcenat /> ))}
                </div>
            )}
        </div>
    );
};