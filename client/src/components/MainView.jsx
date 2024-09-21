// src/components/MainView.jsx
import React from 'react';

import { useState } from 'react';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import TurnDisplay from './TurnDisplay';
import { Alert } from './ui/alert';
import { isAuthenticated } from '../utils/auth.js';

let URL = ''

if(import.meta.env.MODE === 'development') {
  console.log('development')
  URL = import.meta.env.PUBLIC_URL_API_BACKEND
}else {
 URL = import.meta.env.PUBLIC_URL_API_BACKEND 
}


const MainView = () => {
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  },[])
  const handleRegister = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to perform this action');
      return;
    }

    const response = await fetch(`${URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
      body: JSON.stringify({ phone }),
    });

    if (response.ok) {
      console.log('Turn updated successfully');
      setMessage('You have been registered successfully!');
    } else {
      console.error('Failed to update turn');
      setMessage('Failed to register. Please try again.');
    }
  };

  return (
    <div className=" flex flex-col items-center p-6">

      
      <TurnDisplay client:load />

      {/* Registration Form */}
     { isLoggedIn && <form onSubmit={handleRegister} className="w-full max-w-2xl p-4 bg-white shadow-lg rounded-lg">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Register for Your Turn</h3>
        <Input
          type="tel"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mb-4"
          required
        />
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          Register
        </Button>

        {/* Add status when the Register is success */}
        { message && <Alert variant="success" className="mt-4">
          You have been registered successfully!
        </Alert>}
      </form>}
    </div>
  );
};

export default MainView;
