import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStore } from "@nanostores/react";

import { allClients } from "@/currentTurnStore";

const ListPendingClients = () => {
  const $clients = useStore(allClients);
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
            {Object.values($clients).length &&
              Object.values($clients).map((client) => (
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
