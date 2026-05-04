import './App.css';
import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function App() {
  const [visitors, setVisitors] = useState(0);
  const [time, setTime] = useState(new Date());
  const [currentImage, setCurrentImage] = useState(0);
  const [date, setDate] = useState(new Date());
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState('');
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState('');

  const images = [
    '/671.jpg',
    'https://picsum.photos/800/400?random=2',
    'https://picsum.photos/800/400?random=3',
  ];

  useEffect(() => {
    fetch('/api/visitors/')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data?.unique_visitors !== undefined) setVisitors(data.unique_visitors); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/me/', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data?.success) setUser(data.username); });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const addTodo = () => {
    if (todoInput.trim() === '') return;
    setTodos([...todos, todoInput]);
    setTodoInput('');
  };

  const removeTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  const handleLogin = () => {
    if (!username || !password) {
      setLoginError('Fyll i både användarnamn och lösenord');
      return;
    }
    fetch('/api/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.username);
          setLoginError('');
        } else {
          setLoginError('Fel användarnamn eller lösenord');
        }
      })
      .catch(() => setLoginError('Kunde inte nå servern'));
  };

  const handleRegister = () => {
    if (!username || !password) {
      setLoginError('Fyll i både användarnamn och lösenord');
      return;
    }
    fetch('/api/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRegisterSuccess('Konto skapat! Du kan nu logga in.');
          setIsRegistering(false);
          setLoginError('');
        } else {
          setLoginError(data.error);
        }
      })
      .catch(() => setLoginError('Kunde inte nå servern'));
  };

  const handleLogout = () => {
    fetch('/api/logout/', { method: 'POST', credentials: 'include' })
      .then(() => setUser(null));
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter') action();
  };

  if (!user) {
    return (
      <div className="login-page">
        <div className="login-card">
          <img src="/logo.png" alt="frontend/public/webbserverhemsidalogo.png" className="logo-img" />
          <h1>SoundVision</h1>
          <p className="site-subtitle">Din musikupplevelse börjar här</p>

          {registerSuccess && <p className="success-msg">{registerSuccess}</p>}

          <input
            className="login-input"
            placeholder="Användarnamn"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => handleKeyDown(e, isRegistering ? handleRegister : handleLogin)}
          />
          <input
            className="login-input"
            placeholder="Lösenord"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => handleKeyDown(e, isRegistering ? handleRegister : handleLogin)}
          />

          {loginError && <p className="error-msg">{loginError}</p>}

          <div className="btn-row">
            {isRegistering ? (
              <>
                <button className="btn-primary" onClick={handleRegister}>Skapa konto</button>
                <button className="btn-secondary" onClick={() => { setIsRegistering(false); setLoginError(''); }}>Tillbaka</button>
              </>
            ) : (
              <>
                <button className="btn-primary" onClick={handleLogin}>Logga in</button>
                <button className="btn-secondary" onClick={() => { setIsRegistering(true); setLoginError(''); }}>Skapa konto</button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <header className="site-header">
        <div className="header-left">
          <img src="/logo.png" alt="SoundVision logo" className="logo-img" />
          <span className="site-name">SoundVision</span>
        </div>
        <div className="header-right">
          <span className="user-tag">{user}</span>
          <button className="btn-logout" onClick={handleLogout}>Logga ut</button>
        </div>
      </header>

      <div className="info-bar">
        <div className="info-card">
          <span className="info-label">Tid</span>
          <span className="info-value">{time.toLocaleTimeString('sv-SE')}</span>
        </div>
        <div className="info-card">
          <span className="info-label">Datum</span>
          <span className="info-value">{time.toLocaleDateString('sv-SE')}</span>
        </div>
        <div className="info-card">
          <span className="info-label">Unika besökare</span>
          <span className="info-value">{visitors}</span>
        </div>
      </div>

      <div className="main-grid">
        <div className="card">
          <h2>Bildspel</h2>
          <img src={images[currentImage]} alt="bildspel" className="carousel-img" />
        </div>
        <div className="card">
          <h2>Kalender</h2>
          <Calendar onChange={setDate} value={date} locale="sv-SE" />
          <p className="selected-date">Valt datum: {date.toLocaleDateString('sv-SE')}</p>
        </div>
      </div>

      <div className="card">
        <h2>Todo-lista</h2>
        <div className="todo-input-row">
          <input
            className="todo-input"
            value={todoInput}
            onChange={e => setTodoInput(e.target.value)}
            onKeyDown={e => handleKeyDown(e, addTodo)}
            placeholder="Lägg till uppgift..."
          />
          <button className="btn-primary" onClick={addTodo}>Lägg till</button>
        </div>
        <ul className="todo-list">
          {todos.map((todo, index) => (
            <li className="todo-item" key={index}>
              <span>{todo}</span>
              <button className="btn-remove" onClick={() => removeTodo(index)}>Ta bort</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
