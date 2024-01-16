import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Alert from "../components/Alert";

function Organizers({ user }) {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/organizers");
        setOrganizers(response.data); 
      } catch (error) {
        console.error("Błąd podczas pobierania danych z API", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizers();
  }, []);

  const handleShowAlert = () => {
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleDeleteOrganizer = async (id) => {
    try {
      setLoading(true);
      const response = await axios.delete(`http://127.0.0.1:8000/api/organizers/${id}`);
      if (response.status === 200) {
        const newOrganizers = organizers.filter((organizer) => organizer.id !== id);
        setOrganizers(newOrganizers);
        setLoading(false);
        setAlertMessage("Organizator został usunięty.");
        handleShowAlert();
      }

    } catch (error) {
      console.error("Błąd podczas usuwania organizatora", error);
    }
  }

  const handleResetPassword = async (id) => {
    try {
      setLoading(true);
      const response = await axios.post(`http://127.0.0.1:8000/api/reset-password/${id}`);
      if (response.status === 200) {
        setLoading(false);
        setAlertMessage("Hasło zostało zresetowane i wysłane do organizatora.");
        handleShowAlert();
      }
    }
    catch (error) {
      console.error("Błąd podczas resetowania hasła", error);
    }
  }
    return (
      <section className="organizers">
          <Link to="/organizers/add-organizer" className="organizers__add_button">Dodaj organizatora</Link>
          <div className="organizers__wrapper">
            <h3 className="organizers__title">Aktywni organizatorzy</h3>
            {loading ? (
            <span className="loader"></span>
            ) :  organizers.length === 0 ? (
            <p className="organizers__empty">Brak organizatorów</p>) : (
              <ul className="organizers__list">
              {organizers.map((organizer) => (
                <li key={organizer.id} className="organizers__list_item">
                  <div className="organizers__list_item_wrapper">
                    <div className="organizers__list_item_text">{organizer.name} {organizer.surname}</div>
                    <div className="organizers__list_item_dot">·</div>
                    <div className="organizers__list_item_text">{organizer.email}</div>
                    <div className="organizers__list_item_dot">·</div>
                    <div className="organizers__list_item_text">{organizer.phone_number}</div>
                  </div>
                  <div className="organizers__list_item_buttons">
                    <button className="organizers__list_item_button" onClick={() => handleResetPassword(organizer.id)}>Resetuj hasło</button>
                    <button className="organizers__list_item_button">Edytuj</button>
                    <button className="organizers__list_item_button" onClick={() => handleDeleteOrganizer(organizer.id)}>Usuń</button>
                  </div>
                </li>
              ))}
              </ul>
            )}
          </div>
          <Alert message={alertMessage} onClose={handleCloseAlert} show={showAlert}/>
      </section>
    );
  }
    
    export default Organizers;
    