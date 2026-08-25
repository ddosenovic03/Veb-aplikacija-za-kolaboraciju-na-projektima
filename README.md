# Veb aplikacija za kolaboraciju na projektima

Ovo je projekat urađen za diplomski rad. Aplikacija omogućava korisnicima da kreiraju projekte, pozivaju članove, kreiraju poslove, prate napredak i ostavljaju komentare i priloge.

## Korištene tehnologije

- React i TypeScript za frontend
- Node.js, Express i TypeScript za backend
- MySQL baza podataka

## Potrebno za pokretanje

- Node.js 20.19 ili noviji
- MySQL 8
- MySQL Workbench ili drugi program za rad sa MySQL bazom

## Podešavanje baze

1. Pokrenuti MySQL.
2. Otvoriti i izvršiti fajl `backend/database/schema.sql`.
3. Za testne podatke izvršiti `backend/database/test_podaci.sql`.

Napomena: `test_podaci.sql` briše prethodne podatke iz tabela i dodaje nove testne podatke.

## Pokretanje backenda

U folderu `backend` kopirati `.env.example` i kopiju nazvati `.env`. U `.env` treba upisati svoju MySQL lozinku.

Zatim u terminalu pokrenuti:

```bash
cd backend
npm install
npm run dev
```

Backend se pokreće na adresi `http://localhost:3000`.

## Pokretanje frontenda

U drugom terminalu pokrenuti:

```bash
cd frontend
npm install
npm run dev
```

Aplikacija se otvara na adresi `http://localhost:5173`.

## Testni korisnici

Svi testni korisnici imaju lozinku `Test123!`.

| Email | Opis |
| --- | --- |
| `ana.vlasnik@example.com` | Vlasnik projekta |
| `marko.clan@example.com` | Član projekta |
| `ivan.pozvan@example.com` | Korisnik sa pozivom na projekat |

