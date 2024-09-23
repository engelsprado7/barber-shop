import { io } from "socket.io-client";

let URL = "";
if (import.meta.env.MODE === "development") {
  URL = import.meta.env.PUBLIC_URL_API_BACKEND;
} else {
  URL = import.meta.env.PUBLIC_URL_API_BACKEND;
}

export const socket = io(URL);
