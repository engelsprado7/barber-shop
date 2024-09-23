import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { isAuthenticated } from "../utils/auth.js";

let URL = "";

if (import.meta.env.MODE === "development") {
  console.log("development");
  URL = import.meta.env.PUBLIC_URL_API_BACKEND;
} else {
  URL = import.meta.env.PUBLIC_URL_API_BACKEND;
}

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState({});
  const [editedValues, setEditedValues] = useState({});

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());

    if (!isLoggedIn) {
      return window.location.replace("/sign-in");
    }
    const fetchClients = async () => {
      try {
        const response = await fetch(`${URL}/api/clients`); // Adjust the URL to your endpoint
        if (!response.ok) throw new Error("Failed to fetch clients");

        const data = await response.json();
        console.log("data", data.clients);
        setClients(data.clients);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleInputChange = (id, field, value) => {
    console.log("id", id, "field", field, "value", value);
    setEditedValues((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSave = async (id) => {
    const updatedClient = editedValues[id];
    const response = await fetch(`${URL}/api/clients/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
        refresh_token: `${localStorage.getItem("refresh_token")}`,
      },
      body: JSON.stringify(updatedClient),
    });

    console.log("response", response);
    if (response.ok) {
      const updatedClients = clients.map((client) =>
        client.id === id ? { ...client, ...updatedClient } : client,
      );
      setClients(updatedClients);
      setEditMode((prev) => ({ ...prev, [id]: false }));
    } else {
      const errorData = await response.json();
      setError(`Error updating client: ${errorData.message}`);
    }
  };

  const toggleEditMode = (id) => {
    setEditMode((prev) => ({ ...prev, [id]: !prev[id] }));
    if (!editMode[id]) {
      const client = clients.find((client) => client.id === id);
      setEditedValues((prev) => ({
        ...prev,
        [id]: {
          turnNumber: client.turnNumber,
          status: client.status,
          phone: client.phone,
        },
      }));
    }
  };

  //Create a skeleton loader for the table

  if (loading)
    return (
      <div className="animate-pulse">
        <Table>
          <TableCaption>Loading...</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">ID</TableHead>
              <TableHead className="w-[200px]">Turn Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {[1].map((id) => (
              <TableRow key={id}>
                <TableCell>Loading...</TableCell>
                <TableCell>Loading...</TableCell>
                <TableCell>Loading...</TableCell>
                <TableCell>Loading...</TableCell>
                <TableCell>Loading...</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent clients.</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">ID</TableHead>
            <TableHead className="w-[200px]">Turn Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>{client.id}</TableCell>

              <TableCell className="w-[100px]">
                {editMode[client.id] ? (
                  <input
                    type="number"
                    value={
                      editedValues[client.id]?.turnNumber ?? client.turnNumber
                    }
                    onChange={(e) =>
                      handleInputChange(client.id, "turnNumber", e.target.value)
                    }
                    className="border border-gray-300 px-2 py-1"
                  />
                ) : (
                  client.turnNumber
                )}
              </TableCell>

              <TableCell>
                {editMode[client.id] ? (
                  <input
                    type="text"
                    value={editedValues[client.id]?.status ?? client.status}
                    onChange={(e) =>
                      handleInputChange(client.id, "status", e.target.value)
                    }
                    className="border border-gray-300 px-2 py-1"
                  />
                ) : (
                  client.status
                )}
              </TableCell>

              <TableCell>
                {editMode[client.id] ? (
                  <input
                    type="text"
                    value={editedValues[client.id]?.phone ?? client.phone}
                    onChange={(e) =>
                      handleInputChange(client.id, "phone", e.target.value)
                    }
                    className="border border-gray-300 px-2 py-1"
                  />
                ) : (
                  client.phone
                )}
              </TableCell>

              <TableCell>
                {editMode[client.id] ? (
                  <div className="flex gap-1">
                    <Button onClick={() => handleSave(client.id)}>Save</Button>
                    <Button
                      onClick={() => toggleEditMode(client.id)}
                      variant="destructive"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => toggleEditMode(client.id)}
                    variant="outline"
                  >
                    Edit
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Dashboard;
