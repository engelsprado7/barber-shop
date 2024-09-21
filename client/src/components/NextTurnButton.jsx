// src/components/NextTurnButton.jsx
import React from 'react';
import { Button } from "@/components/ui/button"
import { isAuthenticated } from '../utils/auth.js';
let URL = ''

if(import.meta.env.MODE === 'development') {
  console.log('development')
  URL = import.meta.env.PUBLIC_URL_API_BACKEND
}else {
 URL = import.meta.env.PUBLIC_URL_API_BACKEND 
}


const NextTurnButton = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  React.useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);
  const handleNextTurn = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to perform this action');
      return;
    }

    const response = await fetch(`${URL}/api/next`, {
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

  return isLoggedIn && <Button onClick={handleNextTurn}>Next Turn</Button>
};

export default NextTurnButton;
