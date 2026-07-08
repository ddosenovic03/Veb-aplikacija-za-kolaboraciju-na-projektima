import { RowDataPacket } from "mysql2";
import { db } from "../config/db";

interface ProjekatZaProvjeruPrava extends RowDataPacket {
    id: number;
    naziv: string;
    opis: string | null;
    datum_kreiranja: Date;
    vlasnik_id: number;
}

interface ClanstvoZaProvjeruPrava extends RowDataPacket {
    projekat_id: number;
    korisnik_id: number;
    status: "pozvan" | "prihvacen" | "odbijen";
}

interface PosaoZaProvjeruPrava extends RowDataPacket {
    id: number;
    naziv: string;
    opis: string | null;
    rok: Date | string | null;
    datum_kreiranja: Date;
    projekat_id: number;
    kreator_id: number;
    projekat_vlasnik_id: number;
}


interface AngazmanZaProvjeruPrava extends RowDataPacket {
    id: number;
    posao_id: number;
    korisnik_id: number;
    predlozeni_rok: Date | string | null;
    procenat: number;
    projekat_id: number;
}

interface KomentarZaProvjeruPrava extends RowDataPacket {
    id: number;
    sadrzaj: string;
    vidljivost: "javni" | "privatni";
    datum_kreiranja: Date;
    posao_id: number;
    autor_id: number;
    projekat_id: number;
    projekat_vlasnik_id: number;
}

interface PrilogZaProvjeruPrava extends RowDataPacket {
    id: number;
    komentar_id: number;
    tip: "link" | "fajl";
    putanja_fajla: string | null;
    url_linka: string | null;
    datum_kreiranja: Date;
    posao_id: number;
    komentar_autor_id: number;
    komentar_vidljivost: "javni" | "privatni";
    projekat_id: number;
    projekat_vlasnik_id: number;
}

const provjeriValidanId = (id: number, naziv: string) => {
    
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error(`${naziv} nije validan.`);
    }
};

const istiKorisnik = (vrijednostIzBaze: unknown, korisnikId: number) => {

    return Number(vrijednostIzBaze) === Number(korisnikId);
};

/*
==============================================================================
    PROJEKTI
==============================================================================
*/

export const dobaviProjekatZaProvjeruPrava = async (projekatId: number) => {

    provjeriValidanId(projekatId, "ID projekta");

    const [projekti] = await db.query<ProjekatZaProvjeruPrava[]> (
        `
        SELECT
            id,
            naziv,
            opis,
            datum_kreiranja,
            vlasnik_id
        FROM Projekat
        WHERE id = ?
        `,
        [projekatId]
    );

    if (projekti.length === 0) {
        throw new Error("Projekat ne postoji.");
    }

    return projekti[0];
};

export const provjeriVlasnikaProjekta = async (projekatId: number, korisnikId: number) => {

    provjeriValidanId(korisnikId, "ID korisnika");

    const projekat = await dobaviProjekatZaProvjeruPrava(projekatId);

    if (!istiKorisnik(projekat?.vlasnik_id, korisnikId)) {
        throw new Error("Nemate pravo da upravljate ovim projektom.");
    }

    return projekat;
};

export const provjeriClanstvoNaProjektu = async (projekatId: number, korisnikId: number) => {

    provjeriValidanId(projekatId, "ID projekta");
    provjeriValidanId(korisnikId, "ID korisnika");

    await dobaviProjekatZaProvjeruPrava(projekatId);

    const [clanstva] = await db.query<ClanstvoZaProvjeruPrava[]> (
        `
        SELECT
            projekat_id,
            korisnik_id,
            status
        FROM ClanstvoNaProjektu
        WHERE projekat_id = ? AND korisnik_id = ? AND status = 'prihvacen'
        `,
        [projekatId, korisnikId]
    );

    if (clanstva.length === 0) {
        throw new Error("Nemate pravo pristupa ovom projektu.");
    }

    return clanstva[0];
};

export const provjeriPozivNaProjekat = async (projekatId: number, korisnikId: number) => {

    provjeriValidanId(projekatId, "ID projekta");
    provjeriValidanId(korisnikId, "ID korisnika");

    await dobaviProjekatZaProvjeruPrava(projekatId);

    const [pozivi] = await db.query<ClanstvoZaProvjeruPrava[]> (
        `
        SELECT
            projekat_id,
            korisnik_id,
            status
        FROM ClanstvoNaProjektu
        WHERE projekat_id = ? AND korisnik_id = ? AND status = 'pozvan'
        `,
        [projekatId, korisnikId]
    );

    if (pozivi.length === 0) {
        throw new Error("Nemate aktivan poziv za ovaj projekat.");
    }

    return pozivi[0];
};

export const provjeriPravoPregledaProjekta = async (projekatId: number, korisnikId: number) => {

    return await provjeriClanstvoNaProjektu(projekatId, korisnikId);
};

export const provjeriPravoPozivanjaNaProjekat = async (projekatId: number, korisnikId: number) => {

    return await provjeriVlasnikaProjekta(projekatId, korisnikId); 
};

export const provjeriPravoKreiranjaPoslaUProjektu = async (projekatId: number, korisnikId: number) => {

    return await provjeriClanstvoNaProjektu(projekatId, korisnikId); 
};

/*
==============================================================================
    POSLOVI
==============================================================================
*/

export const dobaviPosaoZaProvjeruPrava = async (posaoId: number) => {

    provjeriValidanId(posaoId, "ID posla");

    const [poslovi] = await db.query<PosaoZaProvjeruPrava[]> (
        `
        SELECT
            p.id,
            p.naziv,
            p.opis,
            p.rok,
            p.datum_kreiranja,
            p.projekat_id,
            p.kreator_id,
            pr.vlasnik_id AS projekat_vlasnik_id
        FROM Posao p
        JOIN Projekat pr ON p.projekat_id = pr.id
        WHERE p.id = ?
        `,
        [posaoId]
    );

    if (poslovi.length === 0) {
        throw new Error("Posao ne postoji.");
    }

    return poslovi[0];
};

export const provjeriPravoPrikazaPosla = async (posaoId: number, korisnikId: number) => {

    const posao = await dobaviPosaoZaProvjeruPrava(posaoId);

    await provjeriClanstvoNaProjektu(Number(posao?.projekat_id), korisnikId);

    return posao;
};

export const provjeriPravoPrijaveNaPosao = async (posaoId: number, korisnikId: number) => {

    return await provjeriPravoPrikazaPosla(posaoId, korisnikId);
};

export const provjeriPravoUpravljanjaPoslom = async (posaoId: number, korisnikId: number) => {

    const posao = await dobaviPosaoZaProvjeruPrava(posaoId);
    
    if(!istiKorisnik(posao?.kreator_id, korisnikId) && !istiKorisnik(posao?.projekat_vlasnik_id, korisnikId)) {
        throw new Error("Nemate pravo da upravljate ovim poslom.");
    }

    return posao;
};

export const provjeriPravoIzmjenePosla = async (posaoId: number, korisnikId: number) => {

    return await provjeriPravoUpravljanjaPoslom(posaoId, korisnikId);
};

export const provjeriPravoBrisanjaPosla = async (posaoId: number, korisnikId: number) => {

    return await provjeriPravoUpravljanjaPoslom(posaoId, korisnikId);
};

export const dobaviAngazmanZaProvjeruPrava = async (posaoId: number, korisnikId: number) => {

    provjeriValidanId(posaoId, "ID posla");
    provjeriValidanId(korisnikId, "ID korisnika");

    const [angazmani] = await db.query<AngazmanZaProvjeruPrava[]> (
        `
        SELECT
            a.id,
            a.posao_id,
            a.korisnik_id,
            a.predlozeni_rok,
            a.procenat,
            p.projekat_id
        FROM AngazmanNaPoslu a
        JOIN Posao p ON a.posao_id = p.id
        WHERE a.posao_id = ? AND a.korisnik_id = ?
        `,
        [posaoId, korisnikId]
    );

    if (angazmani.length === 0) {
        throw new Error("Niste angažovani na ovom poslu.");
    }

    return angazmani[0];
};

export const provjeriPravoAzuriranjaProcentaPosla = async (posaoId: number, korisnikId: number) => {

    return await dobaviAngazmanZaProvjeruPrava(posaoId, korisnikId);
};

export const dobaviProjekatIdZaPosao = async (posaoId: number) => {

    const posao = await dobaviPosaoZaProvjeruPrava(posaoId);

    return Number(posao?.projekat_id);
};

/*
==============================================================================
    KOMENTARI
==============================================================================
*/

export const dobaviKomentarZaProvjeruPrava = async (komentarId: number) => {

    provjeriValidanId(komentarId, "ID komentara");

    const [komentari] = await db.query<KomentarZaProvjeruPrava[]> (
        `
        SELECT
            k.id,
            k.sadrzaj,
            k.vidljivost,
            k.datum_kreiranja,
            k.posao_id,
            k.korisnik_id AS autor_id,
            p.projekat_id,
            pr.vlasnik_id AS projekat_vlasnik_id
        FROM Komentar k
        JOIN Posao p ON k.posao_id = p.id
        JOIN Projekat pr ON p.projekat_id = pr.id
        WHERE k.id = ?
        `,
        [komentarId]
    );

    if (komentari.length === 0) {
        throw new Error("Komentar ne postoji.");
    }

    return komentari[0];
};

export const provjeriPravoDodavanjaKomentaraNaPosao = async (posaoId: number, korisnikId: number) => {

    return await provjeriPravoPrikazaPosla(posaoId, korisnikId);
};

export const provjeriPravoPrikazaKomentara = async (komentarId: number, korisnikId: number) => {

    const komentar = await dobaviKomentarZaProvjeruPrava(komentarId);

    await provjeriClanstvoNaProjektu(Number(komentar?.projekat_id), korisnikId);

    if (!(komentar?.vidljivost === "javni") 
            && !istiKorisnik(komentar?.autor_id, korisnikId) 
            && !istiKorisnik(komentar?.projekat_vlasnik_id, korisnikId)) {
        throw new Error("Nemate pravo pristupa ovom komentaru.");
    }

    return komentar;
};

export const provjeriPravoIzmjeneKomentara = async (komentarId: number, korisnikId: number) => {

    const komentar = await dobaviKomentarZaProvjeruPrava(komentarId);

    await provjeriClanstvoNaProjektu(Number(komentar?.projekat_id), korisnikId);

    if(!istiKorisnik(komentar?.autor_id, korisnikId)) {
        throw new Error("Samo autor komentara može izmeniti komentar.");
    }

    return komentar;
};

export const provjeriPravoBrisanjaKomentara = async (komentarId: number, korisnikId: number) => {

    const komentar = await dobaviKomentarZaProvjeruPrava(komentarId);

    await provjeriClanstvoNaProjektu(Number(komentar?.projekat_id), korisnikId);

    if(!istiKorisnik(komentar?.autor_id, korisnikId) && !istiKorisnik(komentar?.projekat_vlasnik_id, korisnikId)) {
        throw new Error("Nemate pravo da obrišete ovaj komentar.");
    }

    return komentar;
};

export const dobaviProjekatIdZaKomentar = async (komentarId: number) => {

    const komentar = await dobaviKomentarZaProvjeruPrava(komentarId);

    return Number(komentar?.projekat_id);
};

/*
==============================================================================
    PRILOZI
==============================================================================
*/

export const dobaviPrilogZaProvjeruPrava = async (prilogId: number) => {

    provjeriValidanId(prilogId, "ID priloga");

    const [prilozi] = await db.query<PrilogZaProvjeruPrava[]> (
        `
        SELECT
            pl.id,
            pl.komentar_id,
            pl.tip,
            pl.putanja_fajla,
            pl.url_linka,
            pl.datum_kreiranja,
            k.posao_id,
            k.korisnik_id AS komentar_autor_id,
            k.vidljivost AS komentar_vidljivost,
            p.projekat_id,
            pr.vlasnik_id AS projekat_vlasnik_id
        FROM Prilog pl
        JOIN Komentar k ON pl.komentar_id = k.id
        JOIN Posao p ON k.posao_id = p.id
        JOIN Projekat pr ON p.projekat_id = pr.id
        WHERE pl.id = ?
        `,
        [prilogId]
    );

    if (prilozi.length === 0) {
        throw new Error("Prilog ne postoji.");
    }

    return prilozi[0];
};

export const provjeriPravoPrikazaPrilogaZaKomentar = async (komentarId: number, korisnikId: number) => {

    return await provjeriPravoPrikazaKomentara(komentarId, korisnikId);
};

export const provjeriPravoDodavanjaPrilogaNaKomentar = async (komentarId: number, korisnikId: number) => {

    const komentar = await dobaviKomentarZaProvjeruPrava(komentarId);

    await provjeriClanstvoNaProjektu(Number(komentar?.projekat_id), korisnikId);

    if (!istiKorisnik(komentar?.autor_id, korisnikId)) {
        throw new Error("Samo autor komentara može dodati prilog na komentar.");
    }

    return komentar;
};

export const provjeriPravoPrikazaPriloga = async (prilogId: number, korisnikId: number) => {

    const prilog = await dobaviPrilogZaProvjeruPrava(prilogId);

    await provjeriClanstvoNaProjektu(Number(prilog?.projekat_id), korisnikId);

    if (!(prilog?.komentar_vidljivost === "javni")
        && !istiKorisnik(prilog?.komentar_autor_id, korisnikId)
        && !istiKorisnik(prilog?.projekat_vlasnik_id, korisnikId)) {
            throw new Error("Nemate pravo pristupa ovom prilogu.");
    }

    return prilog;
};

export const provjeriPravoBrisanjaPriloga = async (prilogId: number, korisnikId: number) => {

    const prilog = await dobaviPrilogZaProvjeruPrava(prilogId);

    await provjeriClanstvoNaProjektu(Number(prilog?.projekat_id), korisnikId);

    if(!istiKorisnik(prilog?.komentar_autor_id, korisnikId) && !istiKorisnik(prilog?.projekat_vlasnik_id, korisnikId)) {
        throw new Error("Nemate pravo da obrišete ovaj prilog.");
    }

    return prilog;
};