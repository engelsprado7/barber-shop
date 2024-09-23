// src/components/NextTurnButton.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { isAuthenticated } from "../utils/auth.js";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useStore } from "@nanostores/react";
import { isCurrentTurn } from "../currentTurnStore.js";

let URL = "";

if (import.meta.env.MODE === "development") {
  console.log("development");
  URL = import.meta.env.PUBLIC_URL_API_BACKEND;
} else {
  URL = import.meta.env.PUBLIC_URL_API_BACKEND;
}

const NextTurnButton = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const $isCurrentTurnSet = useStore(isCurrentTurn);

  React.useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);
  const handleNextTurn = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (!token) {
      alert("You must be logged in to perform this action");
      return;
    }

    const response = await fetch(`${URL}/api/next`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
        refresh_token: refreshToken,
      },
    });

    if (response.ok) {
      const data = await response.json();
      data.currentNumber ? isCurrentTurn.set(true) : isCurrentTurn.set(false);
    } else {
      console.error("Failed to update turn");
    }
    setLoading(false);
  };

  return (
    <div>
      {isLoggedIn && $isCurrentTurnSet && (
        <Button onClick={handleNextTurn} disabled={loading}>
          {loading ? (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Next Turn"
          )}
        </Button>
      )}
    </div>
  );
};

export default NextTurnButton;
