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

  const images = [
    '/671.jpg',
    '/267.jpg',
    'https://picsum.photos/800/400?random=3',
  ];

  // Hämta besökare från backend
  useEffect(() => {
    fetch('/api/visitors/')
      .then(res => res.json())
      .then(data => setVisitors(data.unique_visitors));
  }, []);

  // Uppdatera klockan varje sekund
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Byt bild var 3:e sekund
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Lägg till todo
  const addTodo = () => {
    if (todoInput.trim() === '') return;
    setTodos([...todos, todoInput]);
    setTodoInput('');
  };

  // Ta bort todo
  const removeTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div className="app">
      <h1>Min Hemsida</h1>

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