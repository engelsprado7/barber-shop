import React from "react";

import TurnDisplay from "./TurnDisplay";

import ListPendingClients from "./ListPendingClients.jsx";
import RegisterClient from "./RegisterClient.jsx";

const MainView = () => {
  return (
    <div className="flex flex-col items-center p-6">
      <TurnDisplay client:load />

      <RegisterClient client:load />

      <ListPendingClients client:load />
    </div>
  );
};

export default MainView;
