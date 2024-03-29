import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Paths } from '../../Theme';

function EditJuror() {
    const [jurorData, setJurorData] = useState({
        name: '',
        surname: '',
        phone_number: '',
        email: '',
    });

    const navigate = useNavigate();
    const location = useLocation();
    const organizerId = location.state && location.state.organizerId;

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            if (organizerId) {
              const response = await axios.get(`${Paths.serverApi}/api/organizers/${organizerId}`);
              const userData = response.data;
    
              setJurorData({
                name: userData.name,
                surname: userData.surname,
                phone_number: userData.phone_number,
                email: userData.email,
              });
            }
          } catch (error) {
            console.error('Błąd podczas pobierania danych z API:', error);
          } finally {
            setLoadingData(false);
          }
        };
    
        fetchUserData();
      }, [organizerId]);
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setJurorData({
          ...jurorData,
          [name]: value,
        });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
          // Wyślij zaktualizowane dane do API
          await axios.put(`${Paths.serverApi}/api/organizers/${organizerId}`, jurorData);
          navigate('/jurors');
        } catch (error) {
          console.error('Błąd podczas zapisywania danych:', error);
        } finally {
          setLoading(false);
        }
      };
    

    return (
      <section className="edit-organizer">
       {loadingData ? (
        <span className="loader"></span>
       ) : (
        <div className="add-organizer__form">
        <h3 className="add-organizer__title">Edycja jurora <span className='edit-organizer__name'>{jurorData.name} {jurorData.surname}</span></h3>

        <form onSubmit={handleSubmit} className="add-organizer__form">
          <label className="add-organizer__label">Imię*</label>
          <input
            type="text"
            className="add-organizer__input"
            name="name"
            value={jurorData.name}
            onChange={handleChange}
          />

          <label className="add-organizer__label">Nazwisko*</label>
          <input
            type="text"
            className="add-organizer__input"
            name="surname"
            value={jurorData.surname}
            onChange={handleChange}
          />

          <label className="add-organizer__label">Numer telefonu:</label>
          <input
            type="text"
            className="add-organizer__input"
            name="phone_number"
            value={jurorData.phone_number}
            onChange={handleChange}
          />

          <label className="add-organizer__label">Adres e-mail*</label>
          <input
            type="text"
            className="add-organizer__input"
            name="email"
            value={jurorData.email}
            onChange={handleChange}
          />

          <button type="submit" className="add-organizer__btn edit-organizer__btn_save">
            Zapisz zmiany
          </button>
          <Link to="/jurors" className="add-organizer__btn edit-organizer__btn_cancel">
            Anuluj
          </Link>
        </form>
        {loading && <span className="loader"></span>}
        <p className="App-info">
          Jeżeli wprowadzisz tu jakiekolwiek zmiany poinformuj o tym niezwlocznie jurora!
        </p>
      </div>
        )}
      </section>
    );
}
    
export default EditJuror;
    