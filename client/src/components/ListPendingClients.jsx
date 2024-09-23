import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
let URL = "";

if (import.meta.env.MODE === "development") {
  console.log("development");
  URL = import.meta.env.PUBLIC_URL_API_BACKEND;
} else {
  URL = import.meta.env.PUBLIC_URL_API_BACKEND;
}

const ListPendingClients = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchPendingClients = async () => {
      try {
        const response = await fetch(
          `${URL}/api/clients/pending?status=pending`,
        );
        const data = await response.json();
        console.log("data", data.clients);
        setClients(data.clients);
      } catch (error) {
        console.error("Error fetching pending clients:", error);
      }
    };

    fetchPendingClients();

    return () => {
      // Cleanup
      fetchPendingClients();
    };
  }, []);

  return (
    <div className="flex flex-col gap-2 mt-10">
      <h1 className="text-2xl font-semibold text-gray-800">Pending Clients</h1>
      <div className="flex flex-col gap-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Turn Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Phone</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.turnNumber}</TableCell>
                <TableCell>{client.status}</TableCell>
                <TableCell>{client.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ListPendingClients;
