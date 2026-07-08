export const mapKomentar = (komentar: any) => {

    return  {
        id: komentar.id,
        sadrzaj: komentar.sadrzaj,
        vidljivost: komentar.vidljivost,
        datum_kreiranja: komentar.datum_kreiranja,
        posao_id: komentar.posao_id,
        autor: {
            id: komentar.autor_id,
            ime: komentar.autor_ime,
            prezime: komentar.autor_prezime,
            korisnicko_ime: komentar.autor_korisnicko_ime
        }
    };
};