import { useEffect, useState } from "react";
import { dobaviDashboardStatistiku } from "../../api/dashboardApi";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { Loading } from "../../components/common/Loading";
import { StatCard } from "../../components/common/StatCard";
import type { DashboardStatistika } from "../../types/dashboard";
import { izvuciPorukuGreske } from "../../utils/errorHelper";

export const DashboardPage = () => {

    const [statistika, setStatistika] = useState<DashboardStatistika | null>(null);
    const [ucitavanje, setUcitavanje] = useState(true);
    const [greska, setGreska] = useState<string | null>(null);

    useEffect(() => {

        let aktivnaKomponenta = true;

        const ucitajStatistiku = async () => {
            
            try {
                const podaci = await dobaviDashboardStatistiku();

                if (aktivnaKomponenta) {
                    setStatistika(podaci);
                }
            } catch (error: unknown) {
                if (aktivnaKomponenta) {
                    setGreska(izvuciPorukuGreske(error, "Greška prilikom učitavanja statistike."));
                }
            } finally {
                if (aktivnaKomponenta) {
                    setUcitavanje(false);
                }
            }
        };

        void ucitajStatistiku();

        return () => {
            aktivnaKomponenta = false;
        };
    }, []);

    if (ucitavanje) {
        return <Loading tekst="Učitavanje dashboard-a..." />;
    }
    if (greska) {
        return <ErrorMessage poruka={greska} />;
    }
    if (!statistika) {
        return <ErrorMessage poruka="Nema dostupnih podataka za dashboard." />;
    }

    return (
        <div className="dashboard-page">
            <section className="welcome-section">
                <div>
                    <p className="eyebrow">Pregled aktivnosti</p>
                    <h2>Dobrodošli!</h2>
                    <p>Ovde vidite osnovnu statistiku svojih projekata, poslova, poziva i komentara.</p>
                </div>
            </section>

            <div className="stats-grid">
                <StatCard
                    label="Projekti"
                    value={statistika.broj_projekata}
                    description="Projekti u kojima ste prihvaćen član"
                />

                <StatCard
                    label="Moji poslovi"
                    value={statistika.broj_mojih_poslova}
                    description="Poslovi na kojima ste angažovani"
                />

                <StatCard
                    label="Pozivi"
                    value={statistika.broj_poziva}
                    description="Pozivi na projekte koji čekaju Vaš odgovor"
                />

                <StatCard
                    label="Komentari"
                    value={statistika.broj_komentara}
                    description="Komentari koje ste napisali"
                />
            </div>
        </div>
    );
};