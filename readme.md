# ITP App- Platformă de programari auto în service

Acesta este un proiect de tip personal dedicat serviceurilor auto. Platforma permite utilizatorilor să gestioneze programarile din locația lor prin adaugarea acestora intr-o baza de date care conține:
Nume,Prenume,Nr de telefon, Nr de înmatriculare, data programării și locația la care se efectueaza inspecția. Urmând ca ulterior clienții să primească un mesaj sub forma de:
Vă așteptăm la data de: YYYY-MM-ZZ la stația ITP [insert_locație] cu autovehiculul [insert_inmatriculare].
Mesajul fiind trimis automat la ora 15, pentru toate programările de ziua următoare prin intermediul unui API (Twilio)

## 🛠️ Tehnologii Folosite

Proiectul este construit folosind următoarele tehnologii:

### Frontend

* **[React](https://reactjs.org/)**: O bibliotecă JavaScript pentru construirea interfețelor utilizator.
* **[Vite](https://vitejs.dev/)**: Unelte de frontend (build tool) extrem de rapide, folosite pentru a rula și compila aplicația React.

### Backend

* **[Node.js](https://nodejs.org/)**: Mediul de rulare JavaScript (runtime) pentru server.
* **[Express.js](https://expressjs.com/)**: Un framework minimalist pentru Node.js, folosit pentru a construi API-ul RESTful.
* **[Sequelize](https://sequelize.org/)**: Un ORM (Object-Relational Mapper) bazat pe promisiuni pentru Node.js. Simplifică interacțiunea cu baza de date (ex: PostgreSQL, MySQL, SQLite).
* **Baza de date**: (**mysql**).

---

## ✨ Funcționalități Principale

* **Autentificare Utilizatori**: Creare cont și login
* **înregistrare programări**: Utilizatorii pot crea programări noi.
* **Vizualizarea bazei de date**: Utilizatorii pot vizualiza baza de date și sterge date din aceasta.
* **Vizualizarea bazei de date**: Pentru comoditatea am adăugat și o pagină de register, dar aplicația poate fi accesată DOAR dacă utilizatorul are ADMIN din baza de date prin o valoare boolean
---

## 🚀 Instalare și Rulare Locală

Pentru a rula acest proiect local, vei avea nevoie de [Node.js](https://nodejs.org/en/) instalat dar și de un client pentru baze de date, recomandat [Laragon](https://github.com/leokhoa/laragon/releases)

### 1. Configurare Backend (Server)

1.  Clonează repository-ul:
    ```bash
    git clone [https://github.com/eduardbonea/ITP.git](https://github.com/eduardbonea/ITP.git)
    cd ITP
    cd backend
    npm install
    ```

2.  Navighează în folderul `backend`:
    ```bash
    cd server
    ```

3.  Instalează dependențele:
    ```bash
    npm install
    ```

4.  Configurează mediul (environment):
    * Va trebui să creezi un fișier `.env` în folderul `server`.
    * Acesta trebuie să conțină variabilele de mediu necesare, în special detaliile de conectare la baza de date pentru Sequelize (exemplu mai jos).
    ```env
    # Exemplu de .env pentru server (ajustează cu datele tale)
    DB_USER=nume_utilizator_db
    DB_PASS=parola_db
    DB_HOST=localhost
    DB_NAME=nume_baza_de_date
    DB_PORT=5432 # (sau 3306 pentru MySQL)
    DB_DIALECT=postgres # (sau 'mysql')
    
    JWT_SECRET=o_cheie_secreta_pentru_token
    ```

5.  Rulează migrările Sequelize (dacă există) pentru a crea tabelele:
    ```bash
    npx sequelize-cli db:migrate
    ```

6.  Pornește serverul (în mod 'development', dacă ai configurat `nodemon`):
    ```bash
    npm run dev
    ```
    *Serverul va rula, de obicei, pe `http://localhost:3000` (sau orice port ai setat).*

### 2. Configurare Frontend (Client)

1.  Deschide un terminal **nou**.

2.  Navighează în folderul `client`:
    ```bash
    cd ITP/client 
    # (sau cd ../client dacă ești încă în folderul server)
    ```

3.  Instalează dependențele:
    ```bash
    npm install
    ```

4.  Pornește serverul de dezvoltare Vite:
    ```bash
    npm run dev
    ```
    *Aplicația React va fi accesibilă la `http://localhost:5173` (sau portul indicat de Vite).*

---

## 👨‍💻 Autor

* **Eduard Bonea** - [GitHub](https://github.com/eduardbonea)