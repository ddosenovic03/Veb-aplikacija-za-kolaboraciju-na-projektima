import { useEffect, useState } from "react";
import type { PosaoZaListu } from "../../types/posao";
import { dobaviKreiranePoslove } from "../../api/posaoApi";
import { izvuciPorukuGreske } from "../../utils/errorHelper";
import { Loading } from "../../components/common/Loading";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { PosaoCard } from "../../components/poslovi/PosaoCard";

export const KreiraniPosloviPage = () => {

    const [poslovi, setPoslovi] = useState<PosaoZaListu[]>([]);
    const [ucitavanje, setUcitavanje] = useState(true);
    const [greska, setGreska] = useState<string | null>(null);

    useEffect(() => {
        let aktivnaKomponenta = true;

        const ucitajPoslove = async () => {
            try {
                const podaci = await dobaviKreiranePoslove();

                if (aktivnaKomponenta) setPoslovi(podaci);
            } catch (error: unknown) {
                if (aktivnaKomponenta) setGreska(izvuciPorukuGreske(error, "Kreirani poslovi nisu učitani."));
            } finally {
                if (aktivnaKomponenta) setUcitavanje(false);
            }
        };

        void ucitajPoslove();

        return () => { aktivnaKomponenta = false; };
    }, []);

    if (ucitavanje) return <Loading tekst="Učitavanje kreiranih poslova..."/>

    return (
        <div className="jobs-page">

            <div className="page-actions">
                <div>
                    <p className="eyebrow">Poslovi</p>
                    <h2>Kreirani poslovi</h2>
                    <p className="muted-text">Poslovi koje ste kreirali na projektima.</p>
                </div>
            </div>

            <ErrorMessage poruka={greska}/>

            {poslovi.length === 0 ?
            (
                <section className="empty-state">
                    <h3>Nema kreiranih poslova</h3>
                    <p>Još niste kreirali posao.</p>
                </section>
            ) : 
            (
                <div className="job-grid">
                    {poslovi.map((posao) => ( <PosaoCard key={posao.id} posao={posao} prikaziProjekat /> ))}
                </div>
            )}
        </div>
    );
};