// Create a component called StatusShop that will display the status of the shop. The component will fetch the status from the server and display it in a div with the class name status. The component will receive the status as a prop.

import React, { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { currentShop, isOpen } from "../currentTurnStore.js";
let URL = "";

if (import.meta.env.MODE === "development") {
  console.log("development");
  URL = import.meta.env.PUBLIC_URL_API_BACKEND;
} else {
  URL = import.meta.env.PUBLIC_URL_API_BACKEND;
}

const StatusShop = () => {
  const [shop, setShop] = useState({});
  const $isOpen = useStore(isOpen);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await fetch(`${URL}/api/shop`);
        if (!response.ok) throw new Error("Failed to fetch shop");

        const data = await response.json();
        setShop(data);
        currentShop.set(data);
        isOpen.set(data.status);
      } catch (error) {
        console.error(error);
      }
    };

    fetchShop();

    return () => {
      fetchShop();
    };
  }, []);

  const setStatus = () => {
    if ($isOpen) {
      return (
        <h2 className="open">
          <span role="img" aria-label="open">
            🟢
          </span>{" "}
          Atendiendo
        </h2>
      );
    } else {
      return (
        <h2 className="closed">
          <span role="img" aria-label="closed">
            🔴
          </span>{" "}
          Cerrado
        </h2>
      );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold text-3xl">Bienvenido a {shop?.name}</h1>
      <div className="">{setStatus()}</div>
    </div>
  );
};

export default StatusShop;
