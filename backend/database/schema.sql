CREATE DATABASE IF NOT EXISTS kolaboracija_na_projektu
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE kolaboracija_na_projektu;

CREATE TABLE Korisnik (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ime VARCHAR(100) NOT NULL,
    prezime VARCHAR(100) NOT NULL,
    korisnicko_ime VARCHAR(100) NOT NULL UNIQUE,
    lozinka_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    datum_kreiranja TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Projekat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    naziv VARCHAR(255) NOT NULL,
    opis TEXT,
    datum_kreiranja TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    vlasnik_id INT NOT NULL,
    CONSTRAINT fk_projekat_vlasnik
        FOREIGN KEY (vlasnik_id) REFERENCES Korisnik(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE ClanstvoNaProjektu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    korisnik_id INT NOT NULL,
    projekat_id INT NOT NULL,
    status ENUM('pozvan', 'prihvacen', 'odbijen') NOT NULL DEFAULT 'pozvan',
    CONSTRAINT fk_clanstvo_korisnik
        FOREIGN KEY (korisnik_id) REFERENCES Korisnik(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_clanstvo_projekat
        FOREIGN KEY (projekat_id) REFERENCES Projekat(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT uq_clanstvo UNIQUE (korisnik_id, projekat_id)
);

CREATE TABLE Posao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    naziv VARCHAR(255) NOT NULL,
    opis TEXT,
    rok DATETIME NOT NULL,
    projekat_id INT NOT NULL,
    kreator_id INT NOT NULL,
    datum_kreiranja TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_posao_projekat
        FOREIGN KEY (projekat_id) REFERENCES Projekat(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_posao_kreator
        FOREIGN KEY (kreator_id) REFERENCES Korisnik(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE AngazmanNaPoslu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    posao_id INT NOT NULL,
    korisnik_id INT NOT NULL,
    predlozeni_rok DATETIME,
    procenat INT NOT NULL DEFAULT 0,
    datum_prijave TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_angazman_posao
        FOREIGN KEY (posao_id) REFERENCES Posao(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_angazman_korisnik
        FOREIGN KEY (korisnik_id) REFERENCES Korisnik(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT uq_angazman UNIQUE (posao_id, korisnik_id),
    CONSTRAINT chk_procenat CHECK (procenat >= 0 AND procenat <= 100)
);

CREATE TABLE Komentar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sadrzaj TEXT NOT NULL,
    posao_id INT NOT NULL,
    korisnik_id INT NOT NULL,
    vidljivost ENUM('javni', 'privatni') NOT NULL DEFAULT 'javni',
    datum_kreiranja TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_komentar_posao
        FOREIGN KEY (posao_id) REFERENCES Posao(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_komentar_korisnik
        FOREIGN KEY (korisnik_id) REFERENCES Korisnik(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Prilog (
    id INT AUTO_INCREMENT PRIMARY KEY,
    komentar_id INT NOT NULL,
    tip ENUM('fajl', 'link') NOT NULL,
    putanja_fajla VARCHAR(500),
    url_linka VARCHAR(1000),
    datum_kreiranja TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_prilog_komentar
        FOREIGN KEY (komentar_id) REFERENCES Komentar(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);