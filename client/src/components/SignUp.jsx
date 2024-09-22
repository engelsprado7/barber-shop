// src/components/SignUp.jsx
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card'; // shadcn styled card component
import { Input } from './ui/input'; // shadcn styled input component
import { Button } from './ui/button'; // shadcn styled button component
import { Alert } from './ui/alert'; // shadcn styled alert component for messages
let URL = ''

if(import.meta.env.MODE === 'development') {
  console.log('development')
  URL = import.meta.env.PUBLIC_URL_API_BACKEND
}else {
 URL = import.meta.env.PUBLIC_URL_API_BACKEND 
}


const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    setMessage('');
    setError('');
    try {
      const response = await fetch(`${URL}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Sign-up successful! You can now sign in.');
      } else {
        setError(data.message || 'An error occurred. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-2">
      <Card className="w-full max-w-sm p-4 shadow-lg">
        <CardHeader className="text-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Sign Up</h2>
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
          <Button
            onClick={handleSignUp}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Sign Up
          </Button>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="error">{error}</Alert>}
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-gray-500 text-sm">
            Already have an account? Sign in above.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
