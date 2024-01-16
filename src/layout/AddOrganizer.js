import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Organizer({ user }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [organizerData, setOrganizerData] = useState({
    name: "",
    surname: "",
    phone_number: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrganizerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      // Wysłanie danych za pomocą axios do API Laravel
      const response = await axios.post("http://127.0.0.1:8000/api/organizers", organizerData);

      // Przekierowanie po dodaniu organizatora
      if (response.status === 201) {
        navigate("/organizers");
      }
    } catch (error) {
      console.error("Błąd podczas dodawania organizatora", error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <section className="add-organizer">
      <div className="add-organizer__form">
        <h3 className="add-organizer__title">Dodawanie organizatora</h3>

        <form onSubmit={handleSubmit} className="add-organizer__form">
          <label className="add-organizer__label">Imię*</label>
          <input
            type="text"
            className="add-organizer__input"
            name="name"
            value={organizerData.firstName}
            onChange={handleChange}
          />

          <label className="add-organizer__label">Nazwisko*</label>
          <input
            type="text"
            className="add-organizer__input"
            name="surname"
            value={organizerData.lastName}
            onChange={handleChange}
          />

          <label className="add-organizer__label">Numer telefonu:</label>
          <input
            type="text"
            className="add-organizer__input"
            name="phone_number"
            value={organizerData.phoneNumber}
            onChange={handleChange}
          />

          <label className="add-organizer__label">Adres e-mail*</label>
          <input
            type="text"
            className="add-organizer__input"
            name="email"
            value={organizerData.email}
            onChange={handleChange}
          />

          <button type="submit" className="add-organizer__btn">
            Dodaj organizatora
          </button>
          <Link to="/organizers" className="add-organizer__btn">
            Anuluj
          </Link>
        </form>
        {loading && <span className="loader"></span>}
        <p className="App-info">
          Hasło zostanie wygenerowane automatycznie i zostanie wysłane na podany adres e-mail.
        </p>
      </div>
    </section>
  );
}

export default Organizer;