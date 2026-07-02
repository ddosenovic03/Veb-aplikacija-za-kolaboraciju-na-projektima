import { db } from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { provjeriClanstvoNaProjektu } from "../utils/authorization";

export const prijaviSeNaPosao = async (posaoId: number, korisnikId: number, predlozeniRok?: string) => {

    const [poslovi] = await db.query<RowDataPacket[]>(
        `
        SELECT * FROM Posao
        WHERE id = ?
        `,
        [posaoId]
    );

    const posao = poslovi[0];

    if (!posao) {
        throw new Error("Posao nije pronađen");
    }

    await provjeriClanstvoNaProjektu(korisnikId, posao.projekatId);

    const [postojeciAngazmani] = await db.query<RowDataPacket[]>(
        `
        SELECT * FROM AngazmanNaPoslu
        WHERE korisnik_id = ? AND posao_id = ?
        `,
        [korisnikId, posaoId]
    );

    if (postojeciAngazmani.length > 0) {
        throw new Error("Korisnik je već prijavljen na ovaj posao.");
    }

    const [rezultat] = await db.query<ResultSetHeader>(
        `
        INSERT INTO AngazmanNaPoslu (korisnik_id, posao_id, predlozeni_rok, procenat)
        VALUES (?, ?, ?, 0)
        `,
        [korisnikId, posaoId, predlozeniRok || null]
    );

    return {
        id: rezultat.insertId,
        posaoId: posaoId,
        korisnikId: korisnikId,
        predlozeniRok: predlozeniRok || null,
        procenat: 0
    }
};

export const azurirajProcenatPosla = async (posaoId: number, korisnikId: number, procenat: number) => {

    if (procenat < 0 || procenat > 100) {
        throw new Error("Procenat mora biti između 0 i 100.");
    }

    const [angazmani] = await db.query<RowDataPacket[]>(
        `
        SELECT * FROM AngazmanNaPoslu
        WHERE korisnik_id = ? AND posao_id = ?
        `,
        [korisnikId, posaoId]
    );

    if (angazmani.length === 0) {
        throw new Error("Korisnik nije prijavljen na ovaj posao.");
    }

    await db.query(
        `
        UPDATE AngazmanNaPoslu
        SET procenat = ?
        WHERE korisnik_id = ? AND posao_id = ?
        `,
        [procenat, korisnikId, posaoId]
    );

    return {
        posaoId: posaoId,
        korisnikId: korisnikId,
        procenat: procenat,
        status: procenat === 0 ? "nije_zapocet" : procenat === 100 ? "zavrsen" : "u_toku"
    }
};

export const dobaviDetaljePosla = async (posaoId: number, korisnikId: number) => {
    
    const [poslovi] = await db.query<RowDataPacket[]>(
        `
        SELECT
            p.id,
            p.naziv,
            p.opis,
            p.rok,
            p.datum_kreiranja,
            p.projekat_id,
            p.kreator_id,
            k.ime AS kreator_ime,
            k.prezime AS kreator_prezime,
            k.korisnicko_ime AS kreator_korisnicko_ime,
            COALESCE(ROUND(AVG(a.procenat), 2), 0) AS procenat_posla
        FROM Posao p
        JOIN Korisnik k ON p.kreator_id = k.id
        LEFT JOIN AngazmanNaPoslu a ON p.id = a.posao_id
        WHERE p.id = ?
        GROUP BY
            p.id,
            p.naziv,
            p.opis,
            p.rok,
            p.datum_kreiranja,
            p.projekat_id,
            p.kreator_id,
            k.ime,
            k.prezime,
            k.korisnicko_ime
        `,
        [posaoId]
    );

    const posao = poslovi[0];

    if (!posao) {
        throw new Error("Posao nije pronađen");
    }

    await provjeriClanstvoNaProjektu(korisnikId, posao.projekat_id);

    const [angazovani] = await db.query<RowDataPacket[]>(
        `
        SELECT 
            a.id AS angazman_id,
            a.korisnik_id,
            a.predlozeni_rok,
            a.procenat,
            a.datum_prijave,
            k.ime,
            k.prezime,
            k.korisnicko_ime
        FROM AngazmanNaPoslu a
        JOIN Korisnik k ON a.korisnik_id = k.id
        WHERE a.posao_id = ?
        ORDER BY a.datum_prijave ASC
        `,
        [posaoId]
    );

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
            status: procenat === 0 ? "nije_zapocet" : procenat === 100 ? "zavrsen" : "u_toku",
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

export const dobaviMojePoslove = async (korisnikId: number) => {

    const [poslovi] = await db.query<RowDataPacket[]>(
        `
        SELECT
            p.id,
            p.naziv,
            p.opis,
            p.rok,
            p.datum_kreiranja,
            p.projekat_id,
            pr.naziv AS projekat_naziv,
            p.kreator_id,
            k.ime AS kreator_ime,
            k.prezime AS kreator_prezime,
            k.korisnicko_ime AS kreator_korisnicko_ime,
            a.procenat AS moj_procenat,
            a.predlozeni_rok,
            COALESCE(ROUND(procenat_posla.procenat_posla, 2), 0) AS procenat_posla
        FROM AngazmanNaPoslu a
        JOIN Posao p ON a.posao_id = p.id
        JOIN Korisnik k ON p.kreator_id = k.id
        JOIN Projekat pr ON p.projekat_id = pr.id
        LEFT JOIN (
            SELECT
                posao_id,
                AVG(procenat) as procenat_posla
            FROM AngazmanNaPoslu
            GROUP BY posao_id
        ) procenat_posla ON procenat_posla.posao_id = p.id
        WHERE a.korisnik_id = ?
        ORDER BY p.rok ASC
        `,
        [korisnikId]
    );

    return poslovi.map((posao: any) => {
        const procenat = Number(posao.procenat_posla);

        return {
            ...posao,
            kreator: {
                id: posao.kreator_id,
                ime: posao.kreator_ime,
                prezime: posao.kreator_prezime,
                korisnicko_ime: posao.kreator_korisnicko_ime
            },
            moj_procenat: Number(posao.moj_procenat),
            procenat_posla: procenat,
            status: procenat === 0 ? "nije_zapocet" : procenat === 100 ? "zavrsen" : "u_toku"
        };
    });
};

export const dobaviKreiranePoslove = async (korisnikId: number) => {

    const [poslovi] = await db.query<RowDataPacket[]>(
        `
        SELECT
            p.id,
            p.naziv,
            p.opis,
            p.rok,
            p.datum_kreiranja,
            p.projekat_id,
            pr.naziv AS projekat_naziv,
            COUNT(a.id) AS broj_angazovanih,
            COALESCE(ROUND(AVG(a.procenat), 2), 0) AS procenat_posla
        FROM Posao p
        JOIN Projekat pr ON p.projekat_id = pr.id
        LEFT JOIN AngazmanNaPoslu a ON p.id = a.posao_id
        WHERE p.kreator_id = ?
        GROUP BY
            p.id,
            p.naziv,
            p.opis,
            p.rok,
            p.datum_kreiranja,
            p.projekat_id,
            pr.naziv
        ORDER BY p.datum_kreiranja DESC
        `,
        [korisnikId]
    );

    return poslovi.map((posao: any) => {
        const procenat = Number(posao.procenat_posla);

        return {
            ...posao,
            broj_angazovanih: Number(posao.broj_angazovanih),
            procenat_posla: procenat,
            status: procenat === 0 ? "nije_zapocet" : procenat === 100 ? "zavrsen" : "u_toku"
        }
    });
};