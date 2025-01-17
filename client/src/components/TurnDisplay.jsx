// src/components/TurnDisplay.jsx
import React, { useState, useEffect } from "react";
import { socket } from "../socket";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import NextTurnButton from "./NextTurnButton.jsx";
import { Skeleton } from "@/components/ui/skeleton";
import {
  isCurrentTurn,
  setAllClients,
  allClients,
} from "../currentTurnStore.js";
import { getCurrentClient, getNextClients } from "@/utils/filterClients.js";
import { useStore } from "@nanostores/react";
let URL = "";

if (import.meta.env.MODE === "development") {
  URL = import.meta.env.PUBLIC_URL_API_BACKEND;
} else {
  URL = import.meta.env.PUBLIC_URL_API_BACKEND;
}

const TurnDisplay = () => {
  const [currentNumber, setCurrentNumber] = useState([]);
  const [nextTurns, setNextTurns] = useState([]);
  const [loading, setLoading] = useState(true);
  const $allClients = useStore(allClients);

  useEffect(() => {
    const fetchTurns = async () => {
      const response = await fetch(`${URL}/api/clients`);

      if (response.ok) {
        const data = await response.json();

        const currentTurn = getCurrentClient(data.clients);
        const nextTurns = getNextClients(data.clients);

        setNewClients(data.clients);
        setCurrentNumber(currentTurn);
        setNextTurns(nextTurns);

        if (currentTurn) {
          isCurrentTurn.set(true);
        }

        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    fetchTurns();

    const setNewClients = (clients) => {
      clients.forEach((client) => {
        setAllClients({ ...client });
      });
    };

    //Connect to socket.IO

    // Listen for real-time updates from the server via Socket.io
    function onConnect() {
      console.log("Connected to server");
    }

    function onDisconnect() {
      console.log("Connected to server");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("turnsUpdate");
    };
  }, []);

  useEffect(() => {
    const nextTurns = getNextClients(Object.values($allClients));
    const currentTurn = getCurrentClient(Object.values($allClients));
    setCurrentNumber(currentTurn);
    setNextTurns(nextTurns);
  }, [$allClients]);

  if (loading)
    return (
      <div className="flex flex-col space-y-3 pb-10">
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
    );

  return (
    <div className="min-h-96">
      {/* Current and Next Numbers */}
      <Card className="w-full max-w-2xl mb-6 shadow-lg">
        <CardHeader>
          <h2 className="text-xl font-bold text-center text-gray-800">
            Current Number
          </h2>
        </CardHeader>

        <CardContent className="text-center text-3xl font-semibold text-green-600">
          {currentNumber?.turnNumber || "No clients"}
        </CardContent>

        <CardFooter className="flex justify-center gap-4 mt-4">
          <NextTurnButton client:load />
        </CardFooter>
      </Card>

      {/* Next Two Numbers */}
      <Card className="w-full max-w-2xl mb-6 shadow-lg">
        <CardHeader>
          <h2 className="text-xl font-bold text-center text-gray-800">
            Next Numbers
          </h2>
        </CardHeader>

        <CardContent className="flex justify-center gap-4">
          {nextTurns.length ? (
            nextTurns.map((client) => (
              <span
                key={client.id}
                className="text-2xl text-blue-500 font-semibold"
              >
                {client.turnNumber}
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
