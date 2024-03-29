import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './components/Login';
import NavBar from './components/NavBar';
import Home from './layout/Home';

import Organizers from './layout/organizers/Organizers';
import AddOrganizer from './layout/organizers/AddOrganizer';
import EditOrganizer from './layout/organizers/EditOrganizer';
import InfoOrganizer from './layout/organizers/InfoOrganizer';

import Jurors from './layout/jurors/Jurors';
import EditJuror from './layout/jurors/EditJuror';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (token && userId) {
      setUser({
        token,
        userId,
      });
    }
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  }
  
  return (
    <Router>
      <div className='App'>
        {user ? (
          <>
            <NavBar user={user} />
            <section className='content' id='content'>
              <Routes>
                <Route path="/" element={<Home user={user}/>} />
                <Route path="/organizers" element={<Organizers user={user}/>} />
                <Route path="/organizers/add-organizer" element={<AddOrganizer user={user}/>} />
                <Route path="/organizers/edit-organizer/:id" element={<EditOrganizer user={user}/>} />
                <Route path="/organizers/info-organizer/:id" element={<InfoOrganizer user={user}/>} />
                <Route path="/jurors" element={<Jurors user={user}/>} />
                <Route path="/jurors/edit-juror/:id" element={<EditJuror user={user}/>} />
              </Routes>
            </section>
          </>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </Router>
  );
}

export default App;
