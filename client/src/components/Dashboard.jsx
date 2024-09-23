// src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";

let URL = "";

if (import.meta.env.MODE === "development") {
  console.log("development");
  URL = import.meta.env.PUBLIC_URL_API_BACKEND;
} else {
  URL = import.meta.env.PUBLIC_URL_API_BACKEND;
}

const Dashboard = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

  const handleUpdate = async (id, field, value) => {
    const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ [field]: value }),
    });

    if (response.ok) {
      const updatedClients = clients.map((client) =>
        client.id === id ? { ...client, [field]: value } : client,
      );
      setClients(updatedClients);
    } else {
      const errorData = await response.json();
      setError(`Error updating ${field}: ${errorData.message}`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Client Dashboard</h2>

      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Turn Number</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Phone</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{client.id}</td>

              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="number"
                  value={client.turnNumber}
                  onChange={(e) =>
                    setTurnNumber(client.id, "turnNumber", e.target.value)
                  }
                  className="border border-gray-300 px-2 py-1"
                />
              </td>

              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="text"
                  value={client.status}
                  onChange={(e) =>
                    handleUpdate(client.id, "status", e.target.value)
                  }
                  className="border border-gray-300 px-2 py-1"
                />
              </td>

              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="text"
                  value={client.phone}
                  onChange={(e) =>
                    handleUpdate(client.id, "phone", e.target.value)
                  }
                  className="border border-gray-300 px-2 py-1"
                />
              </td>

              <td className="border border-gray-300 px-4 py-2">
                <Button
                  onClick={() => handleUpdate(client.id, "phone", client.phone)}
                >
                  Save
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
