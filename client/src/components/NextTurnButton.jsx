// src/components/NextTurnButton.jsx
import React from 'react';
import { Button } from "@/components/ui/button"
import { isAuthenticated } from '../utils/auth.js';
import { ReloadIcon } from "@radix-ui/react-icons"

let URL = ''

if (import.meta.env.MODE === 'development') {
  console.log('development')
  URL = import.meta.env.PUBLIC_URL_API_BACKEND
} else {
  URL = import.meta.env.PUBLIC_URL_API_BACKEND
}


const NextTurnButton = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);
  const handleNextTurn = async () => {
    setLoading(true);
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
      setLoading(false);
    } else {
      setLoading(false);
      console.error('Failed to update turn');
    }
  };

  return (
    <div>
      {isLoggedIn &&
        < Button onClick={handleNextTurn} disabled={loading} >
          {loading ? <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            : 'Next Turn'}
        </Button>

      }
    </div >
  )
};

export default NextTurnButton;
