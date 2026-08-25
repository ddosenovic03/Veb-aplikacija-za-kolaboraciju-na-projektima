-- Ova skripta brise stare podatke i dodaje jednostavne podatke za testiranje.
-- Lozinka za sva tri korisnika je: Test123!

USE kolaboracija_na_projektu;
SET NAMES utf8mb4;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE Prilog;
TRUNCATE TABLE Komentar;
TRUNCATE TABLE AngazmanNaPoslu;
TRUNCATE TABLE Posao;
TRUNCATE TABLE ClanstvoNaProjektu;
TRUNCATE TABLE Projekat;
TRUNCATE TABLE Korisnik;

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO Korisnik
    (id, ime, prezime, korisnicko_ime, lozinka_hash, email)
VALUES
    (1, 'Ana', 'Vlasnik', 'ana_vlasnik',
     '$2b$10$2OfICKqikOU.5Tn5dekcB.PVXH6rRhajHz11XYjdy4oJiOkcBLcyG',
     'ana.vlasnik@example.com'),
    (2, 'Marko', 'Clan', 'marko_clan',
     '$2b$10$2OfICKqikOU.5Tn5dekcB.PVXH6rRhajHz11XYjdy4oJiOkcBLcyG',
     'marko.clan@example.com'),
    (3, 'Ivan', 'Pozvani', 'ivan_pozvani',
     '$2b$10$2OfICKqikOU.5Tn5dekcB.PVXH6rRhajHz11XYjdy4oJiOkcBLcyG',
     'ivan.pozvan@example.com');

INSERT INTO Projekat (id, naziv, opis, vlasnik_id)
VALUES
    (1, 'Testni projekat', 'Jednostavan projekat za testiranje aplikacije.', 1);

INSERT INTO ClanstvoNaProjektu (id, korisnik_id, projekat_id, status)
VALUES
    (1, 1, 1, 'prihvacen'),
    (2, 2, 1, 'prihvacen'),
    (3, 3, 1, 'pozvan');

INSERT INTO Posao (id, naziv, opis, rok, projekat_id, kreator_id)
VALUES
    (1, 'Izrada backend API-ja', 'Testni posao koji je u toku.', DATE_ADD(NOW(), INTERVAL 14 DAY), 1, 1),
    (2, 'Izrada frontend stranica', 'Testni posao koji još nije započet.', DATE_ADD(NOW(), INTERVAL 21 DAY), 1, 2);

INSERT INTO AngazmanNaPoslu
    (id, posao_id, korisnik_id, predlozeni_rok, procenat)
VALUES
    (1, 1, 1, DATE_ADD(NOW(), INTERVAL 14 DAY), 50),
    (2, 1, 2, DATE_ADD(NOW(), INTERVAL 14 DAY), 50),
    (3, 2, 2, DATE_ADD(NOW(), INTERVAL 21 DAY), 0);

INSERT INTO Komentar
    (id, sadrzaj, posao_id, korisnik_id, vidljivost)
VALUES
    (1, 'Backend API je djelimično završen.', 1, 2, 'javni'),
    (2, 'Ovo je privatna testna napomena.', 1, 2, 'privatni');

INSERT INTO Prilog
    (id, komentar_id, tip, putanja_fajla, url_linka)
VALUES
    (1, 1, 'link', NULL, 'https://expressjs.com/');

SELECT 'Korisnik' AS tabela, COUNT(*) AS broj FROM Korisnik
UNION ALL SELECT 'Projekat', COUNT(*) FROM Projekat
UNION ALL SELECT 'Posao', COUNT(*) FROM Posao
UNION ALL SELECT 'Komentar', COUNT(*) FROM Komentar;
