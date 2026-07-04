export const mapProjekat = (projekat: any) => {
    
    const procenat = Number(projekat.procenat_projekta);

    return {
        id: projekat.id,
        naziv: projekat.naziv,
        opis: projekat.opis,
        datum_kreiranja: projekat.datum_kreiranja,
        vlasnik_id: projekat.vlasnik_id,
        broj_clanova: Number(projekat.broj_clanova),
        broj_poslova: Number(projekat.broj_poslova),
        procenat_projekta: procenat,
        status: procenat === 0 ? "nije_zapocet" : procenat === 100 ? "zavrsen" : "u toku"
    };
};

export const mapPozivZaProjekat = (poziv: any) => {
    
    return {
        clanstvo_id: poziv.clanstvo_id,
        status: poziv.status,
        projekat: {
            id: poziv.projekat_id,
            naziv: poziv.naziv,
            opis: poziv.opis,
            datum_kreiranja: poziv.datum_kreiranja,
        },
        vlasnik: {
            id: poziv.vlasnik_id,
            ime: poziv.vlasnik_ime,
            prezime: poziv.vlasnik_prezime,
            korisnicko_ime: poziv.vlasnik_korisnicko_ime,
        }
    };
};

export const mapNapredakProjekta = (podaci: any) => {

    return {
        procenat_projekta: Number(podaci.procenat_projekta),
        ukupan_broj_poslova: Number(podaci.ukupan_broj_poslova),
        broj_nezapocetih: Number(podaci.broj_nezapocetih),
        broj_u_toku: Number(podaci.broj_u_toku),
        broj_zavrsenih: Number(podaci.broj_zavrsenih) 
    };
}