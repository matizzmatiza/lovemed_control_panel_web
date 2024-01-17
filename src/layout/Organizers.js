import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import { Paths } from '../Theme';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function Organizers({ user }) {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [resetPasswordModalIsOpen, setResetPasswordModalIsOpen] = useState(false);
  const [deleteOrganizerModalIsOpen, setDeleteOrganizerModalIsOpen] = useState(false);
  const [selectedOrganizerId, setSelectedOrganizerId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const response = await axios.get(`${Paths.serverApi}/api/organizers`);
        setOrganizers(response.data); 
        setSearchResults(response.data);
      } catch (error) {
        console.error("Błąd podczas pobierania danych z API", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizers();
  }, []);

  const openResetPasswordModal = (id) => {
    setSelectedOrganizerId(id);
    setResetPasswordModalIsOpen(true);
  };

  const closeResetPasswordModal = () => {
    setSelectedOrganizerId(null);
    setResetPasswordModalIsOpen(false);
  };

  const openDeleteOrganizerModal = (id) => {
    setSelectedOrganizerId(id);
    setDeleteOrganizerModalIsOpen(true);
  };

  const closeDeleteOrganizerModal = () => {
    setSelectedOrganizerId(null);
    setDeleteOrganizerModalIsOpen(false);
  };

  const ModalCustomStyles = {
    content: {
      width: '350px', 
      height: '200px', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#222',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1rem',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  
    // Filtruj wyniki wyszukiwania na podstawie imienia i nazwiska
    const filteredOrganizers = organizers.filter(
      (organizer) =>
        organizer.name.toLowerCase().includes(query.toLowerCase()) ||
        organizer.surname.toLowerCase().includes(query.toLowerCase())
    );
  
    setSearchResults(filteredOrganizers);
  };

  const handleShowAlert = () => {
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleDeleteOrganizer = async (id) => {
    try {
      setLoading(true);
      const response = await axios.delete(`${Paths.serverApi}/api/organizers/${id}`);
      if (response.status === 200) {
        // Pobierz zaktualizowaną listę organizatorów po usunięciu
        const updatedOrganizers = await axios.get(`${Paths.serverApi}/api/organizers`);
        setOrganizers(updatedOrganizers.data);
        setSearchResults(updatedOrganizers.data);
        setLoading(false);
        setAlertMessage("Organizator został usunięty.");
        handleShowAlert();
        closeDeleteOrganizerModal();
      }
    } catch (error) {
      console.error("Błąd podczas usuwania organizatora", error);
    }
  }

  const handleResetPassword = async (id) => {
    try {
      setLoading(true);
      const response = await axios.post(`${Paths.serverApi}/api/reset-password/${id}`);
      if (response.status === 200) {
        setLoading(false);
        setAlertMessage("Hasło zostało zresetowane i wysłane do organizatora.");
        handleShowAlert();
        closeResetPasswordModal();
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
            <h3 className="organizers__title"><span>Aktywni organizatorzy</span>
            <span>·</span>
            <input
              type="text"
              placeholder="Wyszukaj organizatora"
              value={searchQuery}
              onChange={handleSearchChange}
              className="organizers__search_input"
            />
            </h3>
            {loading ? (
            <span className="loader"></span>
            ) :  organizers.length === 0 ? (
            <p className="organizers__empty">Brak organizatorów</p>) : (
              <ul className="organizers__list">
              {searchResults.map((organizer) => (
                <li key={organizer.id} className="organizers__list_item">
                  <div className="organizers__list_item_wrapper">
                    <div className="organizers__list_item_text">{organizer.name} {organizer.surname}</div>
                    <div className="organizers__list_item_dot">·</div>
                    <div className="organizers__list_item_text">{organizer.email}</div>
                    <div className="organizers__list_item_dot">·</div>
                    <div className="organizers__list_item_text">Tel. {organizer.phone_number}</div>
                  </div>
                  <div className="organizers__list_item_buttons">
                    <button className="organizers__list_item_button organizers__list_item_button--info" onClick={() => navigate(`/organizers/info-organizer/${organizer.id}`, {state: {organizerId: organizer.id}})}>Informacje</button>
                    <button className="organizers__list_item_button organizers__list_item_button--reset-password" onClick={() => openResetPasswordModal(organizer.id)}>Resetuj hasło</button>
                    <button className="organizers__list_item_button organizers__list_item_button--edit" onClick={() => navigate(`/organizers/edit-organizer/${organizer.id}`, {state: {organizerId: organizer.id}})}>Edytuj</button>
                    <button className="organizers__list_item_button organizers__list_item_button--delete" onClick={() => openDeleteOrganizerModal(organizer.id)}>Usuń</button>
                  </div>
                </li>
              ))}
              </ul>
            )}
          </div>
          {/* Resetowanie hasła modal */}
          <Modal
            isOpen={resetPasswordModalIsOpen}
            onRequestClose={closeResetPasswordModal}
            contentLabel="Resetowanie hasła"
            style={ModalCustomStyles}
          >
            <h3>Resetowanie hasła</h3>
            <p>Czy na pewno chcesz zresetować hasło?</p>
            <div className="modal__wrapper">
              <button className="modal__button_action" onClick={() => handleResetPassword(selectedOrganizerId)}>Resetuj</button>
              <button onClick={closeResetPasswordModal} className="modal__button_cancel">Anuluj</button>
            </div>
          </Modal>
          {/* Usuwanie organizatora modal */}
          <Modal
            isOpen={deleteOrganizerModalIsOpen}
            onRequestClose={closeDeleteOrganizerModal}
            contentLabel="Usuwanie organizatora"
            style={ModalCustomStyles}
          >
            <h3>Usuwanie organizatora</h3>
            <p>Czy na pewno chcesz usunąć organizatora?</p>
            <div className="modal__wrapper">
              <button className="modal__button_action" onClick={() => handleDeleteOrganizer(selectedOrganizerId)}>Usuń</button>
              <button onClick={closeDeleteOrganizerModal} className="modal__button_cancel">Anuluj</button>
            </div>
          </Modal>
          <Alert message={alertMessage} onClose={handleCloseAlert} show={showAlert}/>
      </section>
    );
  }
    
    export default Organizers;
    