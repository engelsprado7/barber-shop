import React, { useState, useEffect, useRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Alert } from "./ui/alert";
import { isAuthenticated } from "../utils/auth.js";
import { ReloadIcon } from "@radix-ui/react-icons";
import { setAllClients } from "@/currentTurnStore";
import { Label } from "./ui/label";
let URL = "";

if (import.meta.env.MODE === "development") {
  URL = import.meta.env.PUBLIC_URL_API_BACKEND;
} else {
  URL = import.meta.env.PUBLIC_URL_API_BACKEND;
}
const RegisterClient = () => {
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceTimeout = useRef(null);
  const inputRef = useRef();
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const handleInputChange = (e) => {
    e.preventDefault();
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

  const handleInputNameChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setName(value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refresh_token");
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
      body: JSON.stringify({ phone, name }),
    });

    if (response.ok) {
      const data = await response.json();
      setMessage("You have been registered successfully!");
      const newClient = {
        id: data.id,
        phone,
        turnNumber: data.turnNumber,
        status: data.status,
      };
      setAllClients({ ...newClient });
      setLoading(false);
    } else {
      setLoading(false);
      setMessage("Failed to register. Please try again.");
    }

    setTimeout(() => {
      setMessage("");
      setName("");
      setPhone("");
    }, 1000);
  };
  return (
    <div>
      {/* Registration Form */}
      {isLoggedIn && (
        <form
          onSubmit={handleRegister}
          className="w-full max-w-2xl p-4 bg-white shadow-lg rounded-lg"
        >
          <Label className="text-lg font-bold text-gray-700" htmlFor="name">
            Name
          </Label>
          <Input
            type="text"
            id="name"
            placeholder="Enter your name"
            className="mb-4"
            value={name}
            onChange={handleInputNameChange}
            required
          />
          <Label
            className="text-lg font-bold text-gray-700 mb-4"
            htmlFor="phone"
          >
            Phone Number
          </Label>

          <Input
            ref={inputRef}
            type="tel"
            id="phone"
            placeholder="Enter your phone number"
            value={phone}
            onChange={handleInputChange}
            className="mb-4"
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
    </div>
  );
};

export default RegisterClient;
