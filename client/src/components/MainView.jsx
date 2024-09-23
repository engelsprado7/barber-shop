import React, { useState, useEffect, useRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import TurnDisplay from "./TurnDisplay";
import { Alert } from "./ui/alert";
import { isAuthenticated } from "../utils/auth.js";
import { ReloadIcon } from "@radix-ui/react-icons";
import ListPendingClients from "./ListPendingClients.jsx";

let URL = "";

if (import.meta.env.MODE === "development") {
  console.log("development");
  URL = import.meta.env.PUBLIC_URL_API_BACKEND;
} else {
  URL = import.meta.env.PUBLIC_URL_API_BACKEND;
}

const MainView = () => {
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceTimeout = useRef(null);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setPhone(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (value.length !== 8) {
        setError("Phone number must be exactly 8 characters long.");
      } else {
        setError("");
      }
    }, 300); // 300ms debounce delay
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refresh_token");
    console.log("refresh", refreshToken);
    if (!token) {
      alert("You must be logged in to perform this action");
      setLoading(false);
      return;
    }
    const response = await fetch(`${URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
        refresh_token: refreshToken,
      },
      body: JSON.stringify({ phone }),
    });

    if (response.ok) {
      setMessage("You have been registered successfully!");
      setLoading(false);
    } else {
      setLoading(false);
      setMessage("Failed to register. Please try again.");
    }

    setTimeout(() => {
      setMessage("");
      setPhone("");
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <TurnDisplay client:load />

      {/* Registration Form */}
      {isLoggedIn && (
        <form
          onSubmit={handleRegister}
          className="w-full max-w-2xl p-4 bg-white shadow-lg rounded-lg"
        >
          <h3 className="text-lg font-bold text-gray-700 mb-4">Phone Number</h3>

          <Input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={handleInputChange}
            className="mb-4"
            required
          />
          {error && <p className="text-red-600 mb-4">{error}</p>}

          <Button
            type="submit"
            className={`w-full ${error ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} text-white`}
            disabled={error !== ""}
          >
            {loading ? (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Add Phone"
            )}
          </Button>

          {/* Add status when the Register is success */}
          {message && (
            <Alert variant="success" className="mt-4">
              {message}
            </Alert>
          )}
        </form>
      )}

      <ListPendingClients client:load />
    </div>
  );
};

export default MainView;
