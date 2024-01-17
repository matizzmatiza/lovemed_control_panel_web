import { useState, useEffect } from 'react';
import axios from 'axios';
import { Paths } from '../Theme';
import { useLocation, Link }  from 'react-router-dom';

function InfoOrganizer() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const organizerId = location.state && location.state.organizerId;

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            setLoading(true);
            const response = await axios.get(`${Paths.serverApi}/api/organizers/${organizerId}/events`); // Zastąp 'https://twoje-api-url/uzytkownik' adresem URL twojego API
            const data = response.data;
            console.log(data);
            setLoading(false);
            setUserData(data);
          } catch (error) {
            console.error('Wystąpił błąd podczas pobierania danych:', error);
          }
        };
    
        fetchUserData();
      }, [organizerId]);

    return (
      <section className="info-organizer">
        {loading ? (
            <span className="loader"></span>
        ) : (
            <>
                <h3 className="info-organizer__title">Informacje o organizatorze <span className="info-organizer__name">{userData.organizer.name} {userData.organizer.surname}</span></h3>
                <div className='info-organizer__event_wrapper'>
                    <h3 className='info-organizer__event_title'>Utworzone wydarzenia</h3>
                    {userData.events.length === 0 ? (
                        <p className='info-organizer__event_empty'>Brak wydarzeń</p>
                    ) : (
                        <table className='info-organizer__table'>
                            <thead>
                                <tr className='info-organizer__table_tr'>
                                    <th className='info-organizer__table_th'>Nazwa wydarzenia</th>
                                    <th className='info-organizer__table_th'>Data i godzina rozpoczęcia</th>
                                    <th className='info-organizer__table_th'>Lokalizacja</th>
                                    <th className='info-organizer__table_th'>Ilość jurorów</th>
                                    <th className='info-organizer__table_th'>Ilość uczestników</th>
                                </tr>
                            </thead>
                            <tbody>
                            {userData.events.map((event) => (
                                <tr key={event.id} className='info-organizer__table_tr'>
                                <td className='info-organizer__table_td_name'>{event.event_name}</td>
                                <td className='info-organizer__table_td'>{event.event_start_date} {event.event_start_time}</td>
                                <td className='info-organizer__table_td'>{event.event_place}</td>
                                <td className='info-organizer__table_td'>
                                    {(() => {
                                    let totalJurors = 0;

                                    // eslint-disable-next-line array-callback-return
                                    userData.jurors.map((juror) => {
                                        if (juror.event_id === event.id) {
                                        totalJurors++;
                                        }
                                    })
                                    return totalJurors;
                                    })()}
                                </td>
                                <td className='info-organizer__table_td'>
                                {(() => {
                                    let totalMembers = 0;

                                    // eslint-disable-next-line array-callback-return
                                    userData.members.map((member) => {
                                        if (member.event_id === event.id) {
                                        totalMembers++;
                                        }
                                    })
                                    return totalMembers;
                                    })()}
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <Link to="/organizers" className="info-organizer__button">Wróć</Link>
            </>
        )}
      </section>
    );
  }
    
export default InfoOrganizer;
    