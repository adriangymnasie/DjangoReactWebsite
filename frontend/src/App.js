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
      .then(res => res.json())
      .then(data => setVisitors(data.unique_visitors));
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
      body: JSON.stringify({ username, password }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.username);
          setLoginError('');
        } else {
          setLoginError('❌ Fel användarnamn eller lösenord');
        }
      });
  };

  const handleRegister = () => {
    if (!username || !password) {
      setLoginError('Fyll i både användarnamn och lösenord');
      return;
    }
    fetch('/api/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRegisterSuccess('✅ Konto skapat! Du kan nu logga in.');
          setIsRegistering(false);
          setLoginError('');
        } else {
          setLoginError('❌ ' + data.error);
        }
      });
  };

  const handleLogout = () => {
    fetch('/api/logout/', { method: 'POST' })
      .then(() => setUser(null));
  };

  if (!user) {
    return (
      <div className="app" style={{maxWidth: '400px', margin: '100px auto'}}>
        <h1>{isRegistering ? 'Skapa konto' : 'Logga in'}</h1>

        {registerSuccess && <p style={{color: 'green'}}>{registerSuccess}</p>}

        <input
          placeholder="Användarnamn"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{display: 'block', marginBottom: '10px', width: '100%', padding: '8px'}}
        />
        <input
          placeholder="Lösenord"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{display: 'block', marginBottom: '10px', width: '100%', padding: '8px'}}
        />

        {loginError && <p style={{color: 'red'}}>{loginError}</p>}

        {isRegistering ? (
          <>
            <button onClick={handleRegister} style={{padding: '8px 20px', marginRight: '10px'}}>Skapa konto</button>
            <button onClick={() => { setIsRegistering(false); setLoginError(''); }}>Tillbaka</button>
          </>
        ) : (
          <>
            <button onClick={handleLogin} style={{padding: '8px 20px', marginRight: '10px'}}>Logga in</button>
            <button onClick={() => { setIsRegistering(true); setLoginError(''); }}>Skapa konto</button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <h1>Min Hemsida</h1>
      <p>Inloggad som: {user} <button onClick={handleLogout}>Logga ut</button></p>

      {/* Datum och klocka */}
      <p>{time.toLocaleDateString('sv-SE')} {time.toLocaleTimeString('sv-SE')}</p>

      {/* Unika besökare */}
      <p>Unika besökare: {visitors}</p>

      {/* Bildspel och kalender bredvid varandra */}
      <div style={{display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'flex-start', width: '100%'}}>
        <img src={images[currentImage]} alt="bildspel" style={{width: '50%', height: 'auto'}} />
        <div style={{flex: 1}}>
          <Calendar onChange={setDate} value={date} />
          <p>Valt datum: {date.toLocaleDateString('sv-SE')}</p>
        </div>
      </div>

      {/* Todo-lista */}
      <div style={{marginTop: '20px'}}>
        <h2>Todo-lista</h2>
        <input
          value={todoInput}
          onChange={e => setTodoInput(e.target.value)}
          placeholder="Lägg till uppgift..."
        />
        <button onClick={addTodo}>Lägg till</button>
        <ul>
          {todos.map((todo, index) => (
            <li key={index}>
              {todo} <button onClick={() => removeTodo(index)}>Ta bort</button>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}

export default App;