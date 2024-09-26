// Import modules using ES syntax
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.js';
import turnRoutes from './routes/turns.js';
import shopRoutes from './routes/shop.js';
import { initializeSocket } from './socket.js';


const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json());


// Authentication Routes
app.use('/api', authRoutes);

// Turn Routes (Protected)
app.use('/api', turnRoutes);

// Shop config
app.use('/api', shopRoutes)

// Initialize Socket.io with the server
initializeSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));



