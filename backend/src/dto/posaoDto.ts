export const IzvediStatusIzProcenta = (procenat: number) => {

    if (procenat === 0) return "nije započet";
    if (procenat === 100) return "završen";
    return "u toku";
};

export const mapPosaoZaListu = (posao: any) => {

    const procenat = Number(posao.procenat_posla);

    return {
        ...posao,
        broj_angazovanih: Number(posao.broj_angazovanih),
        procenat_posla: procenat,
        status: IzvediStatusIzProcenta(procenat)
    };
};

export const mapDetaljiPosla = (posao: any, angazovani: any[]) => {

    const procenat = Number(posao.procenat_posla);

    return {
        posao: {
            id: posao.id,
            naziv: posao.naziv,
            opis: posao.opis,
            rok: posao.rok,
            datum_kreiranja: posao.datum_kreiranja,
            projekat_id: posao.projekat_id,
            procenat_posla: procenat,
            status: IzvediStatusIzProcenta(procenat),
            kreator: {
                id: posao.kreator_id,
                ime: posao.kreator_ime,
                prezime: posao.kreator_prezime,
                korisnicko_ime: posao.kreator_korisnicko_ime
            }
        },
        angazovani
    };
};