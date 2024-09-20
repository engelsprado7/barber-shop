// src/components/TurnDisplay.jsx
import React, { useState, useEffect } from 'react';

const TurnDisplay = () => {
  const [turns, setTurns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTurns = async () => {
      const response = await fetch('http://localhost:3000/api/turns');
      const data = await response.json();
      console.log("data", data);
      setTurns(data);
      setLoading(false);
    };

    fetchTurns();

    // const eventSource = new EventSource('http://localhost:5000/api/turns/stream');
    // eventSource.onmessage = (event) => {
    //   const newTurn = JSON.parse(event.data);
    //   setTurns((prev) => [...prev, newTurn].slice(-3));
    // };

    // return () => {
    //   eventSource.close();
    // };
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Current Turn</h2>
      <div>{turns.currentNumber ? `Now Serving: ${turns.currentNumber}` : 'No turns yet.'}</div>
      <div>{turns.nextNumbers.length > 1 ? `Next: ${turns.nextNumbers[0]}` : ''}</div>
      <div>{turns.nextNumbers.length >= 2 ? `After: ${turns.nextNumbers[1]}` : ''}</div>
    </div>
  );
};

export default TurnDisplay;
