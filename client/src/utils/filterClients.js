export const getCurrentClient = (clients) => {
  return clients.filter((client) => client.status === "current")[0];
};
export const getNextClients = (clients) => {
  // Return the next two clients
  return clients.filter((client) => client.status === "pending").slice(0, 2);
};

export const getLastTurnNumber = (clients) => {
  if (Object.values(clients).length) {
    return Object.values(clients).reduce((acc, client) => {
      return Math.max(acc, client.turnNumber);
    }, 0);
  }
};
