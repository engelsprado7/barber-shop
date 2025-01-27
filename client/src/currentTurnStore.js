import { atom, map } from "nanostores";

export const isOpen = atom(false);

export const isCurrentTurn = atom(false);

export const allClients = map({});

export const currentShop = atom({});

export function setAllClients({ id, turnNumber, status, phone }) {
  const existingEntry = allClients.get()[id];
  if (existingEntry) {
    allClients.setKey(id, {
      ...existingEntry,
      status: status,
    });
  } else {
    allClients.setKey(id, { id, turnNumber, status, phone });
  }
}
