// backend/socket.js
import { Server } from 'socket.io';

let io;

export const initializeSocket = (server) => {

    io = new Server(server, {
        cors: {
            origin: '*',
        },
    });

    // Handle connections
    io.on('connection', (socket) => {
        console.log('A user connected');
        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
};

export const getSocket = () => {
    if (!io) {
        throw new Error('Socket.io is not initialized!');
    }
    return io;
};
