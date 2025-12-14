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

1.  Clonează repository-ul și navigheaza în folderul 'backend':
    ```bash
    git clone [https://github.com/eduardbonea/ITP.git](https://github.com/eduardbonea/ITP.git)
    cd ITP
    cd backend
    npm install
    ```
 
2.  Configurează mediul (environment):
    * Va trebui să creezi un fișier `.env` în folderul `backend`.
    * Acesta trebuie să conțină variabilele de mediu necesare, în special detaliile de conectare la baza de date pentru Sequelize (exemplu mai jos).
    ```env
    # Variabile pentru baza de date
    MYSQL_DATABASE='itp-app'
    MYSQL_USER='root'
    DB_PASS=''
    DB_HOST='localhost'
    DB_PORT=3306

    # Variabila pentru portul serverului
    PORT=3001

    #twilio-api
    TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    TWILIO_AUTH_TOKEN=your_auth_token_here
    TWILIO_PHONE_NUMBER=+1234567890


3.  Pornim serverul mysql atât din program cât și cu nodemon: 
    ```bash
    npx nodemon server.js

### 2. Configurare Frontend (Client)

1.  Deschide un terminal **nou**.

2.  Navighează în folderul `frontend`:
    ```bash
    cd ITP/client 

3.  Instalează dependențele:
    ```bash
    npm install
    ```

4.  Da un Build aplicației de React:
    ```bash
    npm run build
    ```
    Apoi porneste aplicația
    ```bash
    npm run dev
    ```
    
    *Aplicația React va fi accesibilă la `http://localhost:3000` (sau portul indicat de Vite).*

---

## 👨‍💻 Autor

* **Eduard Bonea** - [GitHub](https://github.com/eduardbonea)
                   - [Website](http://http://eduardbonea.com)
