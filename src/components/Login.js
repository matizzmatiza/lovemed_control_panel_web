import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email,
        password,
      });

      const loggedInUser = response.data;
      onLogin(loggedInUser);
      setLoading(false);
      localStorage.setItem('token', loggedInUser.token);
      localStorage.setItem('userId', loggedInUser.userId);

    } catch (error) {
      console.error('Błąd logowania:', error);
    }
  }
  
  return (
    <>
    <section className='login'>
      <div className='login__form'>
        <h2 className='login__title'>SYSTEM LOVEMED</h2>
        <label className='login__label'>Email:</label>
        <input type="text" className='login__input' value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className='login__label'>Hasło:</label>
        <input type="password" className='login__input' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin} className='login__btn'>Zaloguj</button>
      </div>
      {loading && <span className="loader"></span>}
    </section>
  </>
  );
}

export default Login;
