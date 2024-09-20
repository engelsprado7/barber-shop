// src/components/TurnDisplay.jsx
import React, { useState, useEffect } from 'react';
import { socket } from '../socket';


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

    //Connect to socket.IO


    // Listen for real-time updates from the server via Socket.io
    function onConnect() {
      console.log('Connected to server');
    }

    function onDisconnect() {
      console.log('Connected to server');

    }

    function onFooEvent(value) {
      console.log('Connected to server');

    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);

    // Listen for real-time updates from the server via Socket.io
    socket.on('turnsUpdate', (updatedTurns) => {
      console.log('Turns updated:', updatedTurns);
      setTurns(updatedTurns); // Show only the last 3 turns: current and next two
    });

 
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
            socket.off('turnsUpdate');

    };
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
