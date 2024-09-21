// src/components/TurnDisplay.jsx
import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import NextTurnButton from "./NextTurnButton.jsx";
import { Skeleton } from "@/components/ui/skeleton"

let URL = ''

if (import.meta.env.MODE === 'development') {
  console.log('development')
  URL = import.meta.env.PUBLIC_URL_API_BACKEND
} else {
  URL = import.meta.env.PUBLIC_URL_API_BACKEND
}


const TurnDisplay = () => {
  const [turns, setTurns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTurns = async () => {
      console.log('Fetching turns...', URL);
      const response = await fetch(`${URL}/api/turns`);
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


    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    // Listen for real-time updates from the server via Socket.io
    socket.on('turnsUpdate', (updatedTurns) => {
      console.log('Turns updated:', updatedTurns);
      setTurns(updatedTurns); // Show only the last 3 turns: current and next two
    });


    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('turnsUpdate');

    };
  }, []);

  if (loading) return <div className="flex flex-col space-y-3 pb-10">
    <Skeleton className="h-[125px] w-[250px] rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>

    <Skeleton className="h-[125px] w-[250px] rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  </div>

  return (
    <div className='min-h-96 pb-10  '>
      {/* Current and Next Numbers */}
      <Card className="w-full max-w-2xl mb-6 shadow-lg">
        <CardHeader>
          <h2 className="text-xl font-bold text-center text-gray-800">Current Number</h2>
        </CardHeader>
        <CardContent className="text-center text-3xl font-semibold text-green-600">
          {turns.currentNumber || 'No clients'}
        </CardContent>
        <CardFooter className="flex justify-center gap-4 mt-4">
          <NextTurnButton />
        </CardFooter>
      </Card>

      {/* Next Two Numbers */}
      <Card className="w-full max-w-2xl mb-6 shadow-lg">
        <CardHeader>
          <h2 className="text-xl font-bold text-center text-gray-800">Next Numbers</h2>
        </CardHeader>
        <CardContent className="flex justify-center gap-4">
          {turns.nextNumbers.length ? (
            turns.nextNumbers.map((num) => (
              <span key={num} className="text-2xl text-blue-500 font-semibold">
                {num}
              </span>
            ))
          ) : (
            <span className="text-xl text-gray-500">No clients waiting</span>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TurnDisplay;
