import './App.css';
import { useState, useEffect } from 'react';

function App() {
  // State för besökare, tid och bildspel
  const [visitors, setVisitors] = useState(0);
  const [time, setTime] = useState(new Date());
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    'https://picsum.photos/800/400?random=1',
    'https://picsum.photos/800/400?random=2',
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

      {/* Bildspel */}
      <img src={images[currentImage]} alt="bildspel" style={{width: '100%', maxWidth: '800px'}} />
    </div>
  );
}

export default App;