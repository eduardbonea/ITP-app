import { useState, useEffect } from "react";
import "./App.css";

export const API_URL = "https://itp.eduardbonea.com/api";

export default function MainApp() {
  const [view, setView] = useState("form");
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    email: "",
    date: "",
    service: "Valea Dragului",
  });
  const [submissions, setSubmissions] = useState([]);
  const [serviceFilter, setServiceFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [smsStatus, setSmsStatus] = useState(null);

  useEffect(() => {
    if (view === "data") {
      fetchbooking();
    }
  }, [view]);

  const fetchbooking = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/booking`);

      if (!response.ok) {
        throw new Error("Eroare la încărcarea programărilor");
      }

      const data = await response.json();
      setSubmissions(data);
    } catch (err) {
      console.error("Eroare la încărcarea programărilor:", err);
      setError(
        "Eroare la încărcarea programărilor. Vă rugăm să încercați din nou mai târziu."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Eroare la trimiterea programării"
        );
      }

      setFormData({
        name: "",
        surname: "",
        phone: "",
        email: "",
        date: "",
        service: "Valea Dragului",
      });

      setView("data");
    } catch (err) {
      console.error("Eroare la trimiterea programării:", err);
      setError(
        err.message ||
          "Eroare la trimiterea programării. Vă rugăm să încercați din nou mai târziu."
      );
    } finally {
      setLoading(false);
    }
  };

  const triggerSendSMS = async () => {
    setLoading(true);
    setSmsStatus(null);

    try {
      const response = await fetch(`${API_URL}/send-sms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Eroare la trimiterea SMS-urilor");
      }

      const result = await response.json();
      setSmsStatus({
        success: true,
        message: "SMS-urile au fost trimise cu succes!",
      });
    } catch (err) {
      console.error("Eroare la trimiterea SMS-urilor:", err);
      setSmsStatus({
        success: false,
        message:
          "Eroare la trimiterea SMS-urilor. Vă rugăm să încercați din nou.",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendTestSMS = async (phoneNumber) => {
    if (!phoneNumber) {
      setSmsStatus({
        success: false,
        message: "Vă rugăm să introduceți un număr de telefon valid.",
      });
      return;
    }

    setLoading(true);
    setSmsStatus(null);

    try {
      const response = await fetch(`${API_URL}/test-sms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      if (!response.ok) {
        throw new Error("Eroare la trimiterea SMS-ului de test");
      }

      const result = await response.json();
      setSmsStatus({
        success: true,
        message: "SMS-ul de test a fost trimis cu succes!",
      });
    } catch (err) {
      console.error("Eroare la trimiterea SMS-ului de test:", err);
      setSmsStatus({
        success: false,
        message:
          "Eroare la trimiterea SMS-ului de test. Vă rugăm să încercați din nou.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions =
    serviceFilter === "all"
      ? submissions
      : submissions.filter((item) => item.service === serviceFilter);

  return (
    <div className="aplicatie-container">
      <div className="aplicatie-continut">
        <header className="aplicatie-header">
          <h1 className="aplicatie-titlu">Sistem de Programări</h1>
          <div className="aplicatie-navigare">
            <button
              className={`buton-navigare ${
                view === "form" ? "buton-activ" : "buton-inactiv"
              }`}
              onClick={() => setView("form")}
            >
              Formular Programare
            </button>
            <button
              className={`buton-navigare ${
                view === "data" ? "buton-activ" : "buton-inactiv"
              }`}
              onClick={() => setView("data")}
            >
              Vezi Programări
            </button>
          </div>
        </header>

        {error && (
          <div className="mesaj-eroare" role="alert">
            <p>{error}</p>
          </div>
        )}

        {view === "form" ? (
          <FormularProgramare
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            loading={loading}
          />
        ) : view === "data" ? (
          <VizualizareProgramari
            submissions={filteredSubmissions}
            serviceFilter={serviceFilter}
            setServiceFilter={setServiceFilter}
            loading={loading}
            refresh={fetchbooking}
          />
        ) : (
          <SMSManagement
            triggerSendSMS={triggerSendSMS}
            sendTestSMS={sendTestSMS}
            loading={loading}
            smsStatus={smsStatus}
          />
        )}
      </div>
    </div>
  );
}

function FormularProgramare({
  formData,
  handleInputChange,
  handleSubmit,
  loading,
}) {
  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <div className="formular-container">
      <h2 className="formular-titlu">Programare Nouă</h2>

      <form onSubmit={onSubmit}>
        <div className="formular-grid">
          <div className="formular-grup">
            <label htmlFor="name" className="formular-eticheta">
              Nume
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="formular-input"
            />
          </div>

          <div className="formular-grup">
            <label htmlFor="surname" className="formular-eticheta">
              Prenume
            </label>
            <input
              type="text"
              id="surname"
              name="surname"
              value={formData.surname}
              onChange={handleInputChange}
              required
              className="formular-input"
            />
          </div>

          <div className="formular-grup">
            <label htmlFor="phone" className="formular-eticheta">
              Număr de Telefon
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="formular-input"
            />
          </div>

          <div className="formular-grup">
            <label htmlFor="email" className="formular-eticheta">
              Numar de înmatriculare
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="formular-input"
            />
          </div>

          <div className="formular-grup">
            <label htmlFor="date" className="formular-eticheta">
              Data
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="formular-input"
            />
          </div>

          <div className="formular-grup">
            <label htmlFor="service" className="formular-eticheta">
              Stație ITP
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleInputChange}
              required
              className="formular-select"
            >
              <option value="Valea Dragului">Valea Dragului</option>
              <option value="2">Stație ITP 2</option>
            </select>
          </div>
        </div>

        <div className="formular-buton-container">
          <button
            type="submit"
            disabled={loading}
            className="formular-buton-submit"
          >
            {loading ? "Se trimite..." : "Trimite Programarea"}
          </button>
        </div>
      </form>
    </div>
  );
}

function VizualizareProgramari({
  submissions,
  serviceFilter,
  setServiceFilter,
  loading,
  refresh,
}) {
  const handleDelete = async (id) => {
    if (
      window.confirm("Sunteți sigur că doriți să ștergeți această programare?")
    ) {
      try {
        const response = await fetch(`${API_URL}/booking/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          refresh();
        } else {
          alert("Eroare la ștergerea programării");
        }
      } catch (error) {
        console.error("Eroare la ștergerea programării:", error);
        alert("A apărut o eroare la ștergerea programării");
      }
    }
  };

  return (
    <div className="vizualizare-container">
      <div className="vizualizare-header">
        <h2 className="vizualizare-titlu">Programări</h2>

        <div className="vizualizare-actiuni">
          <button onClick={refresh} className="buton-reimprospatare">
            Reîmprospătează
          </button>

          <div className="filtru-container">
            <label htmlFor="filterService" className="filtru-eticheta">
              Filtrează după Stație ITP:
            </label>
            <select
              id="filterService"
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="filtru-select"
            >
              <option value="all">Toate Stațiile ITP</option>
              <option value="Valea Dragului">Valea Dragului</option>
              <option value="2">Stație ITP 2</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="mesaj-incarcare">Se încarcă programările...</div>
      ) : submissions.length === 0 ? (
        <div className="mesaj-gol">
          Nu s-au găsit programări. Adaugă una folosind formularul de
          programare.
        </div>
      ) : (
        <div className="tabel-container">
          <table className="tabel-programari">
            <thead className="tabel-header">
              <tr>
                <th className="tabel-celula-header">Nume</th>
                <th className="tabel-celula-header">Prenume</th>
                <th className="tabel-celula-header">Telefon</th>
                <th className="tabel-celula-header">Nr de inmatriculare</th>
                <th className="tabel-celula-header">Data</th>
                <th className="tabel-celula-header">Stație ITP</th>
                <th className="tabel-celula-header">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="tabel-body">
              {submissions.map((submission) => (
                <tr key={submission.id} className="tabel-rand">
                  <td className="tabel-celula">{submission.name}</td>
                  <td className="tabel-celula">{submission.surname}</td>
                  <td className="tabel-celula">{submission.phone}</td>
                  <td className="tabel-celula">{submission.email}</td>
                  <td className="tabel-celula">{submission.date}</td>
                  <td className="tabel-celula">
                    {" "}
                    {/* nume statie programari */} {submission.service}
                  </td>
                  <td className="tabel-celula">
                    <button
                      onClick={() => handleDelete(submission.id)}
                      className="buton-stergere"
                    >
                      Șterge
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
