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

## 🚀 Instalare și Rulare

Utilizarea Docker este cea mai simplă și rapidă metodă, eliminând cerințele de instalare Node.js, MySQL sau FFmpeg direct pe sistemul personal

### 0. Precondiții Esențiale

* **[Docker Desktop](https://www.docker.com/products/docker-desktop)** 

### 1. Clonarea Proiectului

Deschide terminalul și clonează repository-ul:

```bash
git clone [https://github.com/eduardbonea/ITP-app.git](https://github.com/eduardbonea/ITP-app.git)
cd cctv-app
````

### 2\. Configurare Variabile de Mediu

Variabilele sunt definite în `docker-compose.yml` ca să fie importate din `.env`, este nevoie să creați un fișier `.env` în directorul `backend/` cu următoarea structură:

```bash
DB_PORT=3306

# Twilio Credentials
TWILIO_ACCOUNT_SID= 
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

#DOCKER
MYSQL_ROOT_PASSWORD=

# Database Configuration
MYSQL_DATABASE=
MYSQL_USER=
MYSQL_PASSWORD=
DB_HOST=database
```

### 3\. Pornirea Aplicației (Build & Run)

Execută această comandă pentru a construi imaginile Docker necesare și a porni toate serviciile (backend, frontend, bază de date) în fundal:

```bash
docker-compose up --build -d
```

### 4\. Accesarea Aplicației

După ce containerele au pornit cu succes:

| Serviciu | Adresă Implicită |
| :--- | :--- |
| **Frontend (Aplicația Web)** | `http://localhost:80` |
| **Backend (API)** | `http://localhost:3004` |
| **Database (mysql)** | `http://localhost:3306` |

### 5\. Oprirea și Curățarea

Pentru a opri și șterge containerele fără a pierde datele stocate în volume:

```bash
docker-compose down
```

Pentru a șterge complet toate containerele, imaginile și **volumele de date (inclusiv datele MySQL stocate)**:

```bash
docker-compose down --rmi all -v
```

-----

## 👨‍💻 Autor

  * **Eduard Bonea**
      * [GitHub](https://github.com/eduardbonea)
      * [Website](https://eduardbonea.com)