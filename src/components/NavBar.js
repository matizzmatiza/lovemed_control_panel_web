import { NavLink } from "react-router-dom";

function NavBar({ user }) {

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.reload();
  }

  return (
    <nav className="nav">
      <h3 className="nav__title">Panel zarządzania
      <p className="nav__user">Zalogowany: Mateusz Tuczyński</p>
      </h3>
      <ul className="nav__list">
          <li className="nav__item">
              <NavLink to="/" className={({ isActive }) => isActive ? "nav__link nav__link--active": 'nav__link'}>Home</NavLink>
          </li>
          <li className="nav__item">
              <NavLink to="/organizers" className={({ isActive }) => isActive ? "nav__link nav__link--active": 'nav__link'}>Organizatorzy</NavLink>
          </li>
          <li className="nav__item">
              <NavLink to="/" onClick={handleLogout} className="nav__link">Wyloguj się</NavLink>
          </li>
      </ul>
    </nav>
  );
}
  
  export default NavBar;
  