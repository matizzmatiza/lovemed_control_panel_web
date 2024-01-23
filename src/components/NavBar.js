import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Paths } from "../Theme";
import axios from "axios";

function NavBar({ user }) {
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${Paths.serverApi}/api/users/${user.userId}`);
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [user.userId]);

  const handleLogout = () => {
    
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
    window.location.reload();
  }

  return (
    <nav className="nav">
      <h3 className="nav__title">Panel zarządzania<br />
      {loading ? (
        <span className="loader"></span>
      ) : (
        <span className="nav__user">Zalogowano: {userInfo.name} {userInfo.surname}</span>
      )}
      </h3>
      <ul className="nav__list">
          <li className="nav__item">
              <NavLink to="/" className={({ isActive }) => isActive ? "nav__link nav__link--active": 'nav__link'}>Home</NavLink>
          </li>
          <li className="nav__item">
              <NavLink to="/organizers" className={({ isActive }) => isActive ? "nav__link nav__link--active": 'nav__link'}>Organizatorzy</NavLink>
          </li>
          <li className="nav__item">
              <NavLink to="/jurors" className={({ isActive }) => isActive ? "nav__link nav__link--active": 'nav__link'}>Jurorzy</NavLink>
          </li>
          <li className="nav__item">
              <NavLink to="/" onClick={handleLogout} className="nav__link">Wyloguj się</NavLink>
          </li>
      </ul>
    </nav>
  );
}
  
export default NavBar;
  