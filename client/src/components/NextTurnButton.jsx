// src/components/NextTurnButton.jsx
import React from 'react';

const NextTurnButton = () => {
  const handleNextTurn = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to perform this action');
      return;
    }

    const response = await fetch('http://localhost:3000/api/next', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    });

    if (response.ok) {
      console.log('Turn updated successfully');
    } else {
      console.error('Failed to update turn');
    }
  };

  return <button onClick={handleNextTurn}>Next Turn</button>;
};

export default NextTurnButton;
