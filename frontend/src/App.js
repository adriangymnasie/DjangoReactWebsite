import './App.css';
import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function App() {
  const [visitors, setVisitors] = useState(0);
  const [time, setTime] = useState(new Date());
  const [currentImage, setCurrentImage] = useState(0);
  const [date, setDate] = useState(new Date());

  const images = [
    #kallas CORS/hotlink-skydd blockeras av värden
    "https://d.ibtimes.com/en/full/4631936/67-meme-kid.jpg?w=736&f=7865325e2f7823c1f2a16563bcf0a094",
    'https://image.zeta-ai.io/profile-image/c06a4529-2bb2-4a05-8fe0-f8379befe252/472a98c3-f13f-429f-8208-8ca78a82ba39/b11f3c7d-c6e1-4069-98af-3ee3a2974cf6.jpeg?w=828&q=90&f=webp',
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

return (
    <div className="app">
      <h1>Min Hemsida</h1>

      {/* Datum och klocka */}
      <p>{time.toLocaleDateString('sv-SE')} {time.toLocaleTimeString('sv-SE')}</p>

      {/* Unika besökare */}
      <p>Unika besökare: {visitors}</p>

      {/* Bildspel och kalender bredvid varandra */}
      <div style={{display: 'flex', flexWrap: 'nowrap', gap: '20px', alignItems: 'flex-start'}}>
  <img src={images[currentImage]} alt="bildspel" style={{width: '50%'}} />
  <div style={{flexShrink: 0}}>
    <Calendar onChange={setDate} value={date} />
    <p>Valt datum: {date.toLocaleDateString('sv-SE')}</p>
  </div>
</div>
    </div>
  );
}

export default App;