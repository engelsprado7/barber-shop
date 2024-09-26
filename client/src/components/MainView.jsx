import React from "react";

import TurnDisplay from "./TurnDisplay";

import ListPendingClients from "./ListPendingClients.jsx";
import RegisterClient from "./RegisterClient.jsx";
import StatusShop from "./StatusShop.jsx";

const MainView = () => {
  return (
    <div className="flex flex-col md:items-center gap-4 p-6">
      <StatusShop client:load />
      <TurnDisplay client:load />

      <RegisterClient client:load />

      <ListPendingClients client:load />
    </div>
  );
};

export default MainView;
