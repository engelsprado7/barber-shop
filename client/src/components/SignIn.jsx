// src/components/SignIn.jsx
import React, { useState } from 'react';
import { Input } from './ui/input'; // Shadcn styled input component
import { Button } from './ui/button'; // Shadcn styled button component
import { Card, CardHeader, CardContent } from './ui/card'; // Shadcn styled card component
import { Alert } from './ui/alert'; // Shadcn styled alert component for messages
let URL = ''

if(import.meta.env.MODE === 'development') {
  console.log('development')
  URL = import.meta.env.PUBLIC_URL_API_BACKEND
}else {
 URL = import.meta.env.PUBLIC_URL_API_BACKEND 
}


const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    setMessage('');
    setError('');
    try {
      const response = await fetch(`${URL}/api/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('refresh_token', data.refreshToken);
        setMessage('Sign-in successful!');
        setTimeout(() => {
          //redirect to the home page
          window.location.href = '/';
        }, 2000);
      } else {
        setError(data.message || 'An error occurred. Please try again.');
      }
    } catch (err) {
      console.log(err)
      setError('Network error. Please check your connection.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-2">
      <Card className="w-full max-w-sm p-4 shadow-lg">
        <CardHeader className="text-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Sign In</h2>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            required
          />
        
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
            required
          />
        
          <Button onClick={handleSignIn} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Sign In
          </Button>
         
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="error">{error}</Alert>}
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
