import React, { useState, useCallback, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input"; // Assuming you have an Input component
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { setAllClients } from "@/currentTurnStore";
import { isAuthenticated } from "../utils/auth.js";

let URL = "";

if (import.meta.env.MODE === "development") {
  console.log("development");
  URL = import.meta.env.PUBLIC_URL_API_BACKEND;
} else {
  URL = import.meta.env.PUBLIC_URL_API_BACKEND;
}

const SearchContacts = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const debounceTimeout = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const handleInputChange = useCallback((e) => {
    setLoading(true);
    const value = e.target.value.trim();
    setQuery(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (value) {
        fetchResults(value);
        setLoading(false);
      } else {
        setResults([]);
        setLoading(false);
      }
    }, 500); // 300ms debounce delay
  }, []);

  const fetchResults = async (searchQuery) => {
    try {
      const config = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
          refresh_token: `${localStorage.getItem("refresh_token")}`,
        },
      };
      const response = await fetch(
        `${URL}/api/contacts/search?query=${searchQuery}`,
        config,
      );
      const data = await response.json();
      console.log(data);
      setResults(data.contacts);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  // Create a function to register a client to the clients table
  // This function should make a POST request to the /api/clients endpoint
  const registerClient = async (client) => {
    try {
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
          refresh_token: `${localStorage.getItem("refresh_token")}`,
        },
        body: JSON.stringify(client),
      };
      const response = await fetch(`${URL}/api/register`, config);
      const data = await response.json();

      if (response.ok) {
        const newClient = {
          id: client.id,
          phone: client.phone,
          name: client.name,
          turnNumber: data.turnNumber,
          status: data.status,
        };
        setAllClients({ ...newClient });
      }

      console.log(data);
    } catch (error) {
      console.error("Error registering client:", error);
    }
  };
  return (
    <>
      {isLoggedIn && (
        <div className="flex flex-col gap-4">
          <Label>Search for clients</Label>
          <Input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search by name or phone number"
          />
          <div>
            {results &&
              results.map((client) => (
                <div
                  key={client.id}
                  className="flex flex-row gap-1 justify-start items-center"
                >
                  <p>{client.name} -</p>
                  <p>{client.phone}</p>
                  <Button onClick={() => registerClient(client)}>
                    Enlistar
                  </Button>
                </div>
              ))}
          </div>
          <div>
            {loading && <p>Loading...</p>}
            {!loading && results.length === 0 && <p>No results found</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default SearchContacts;
