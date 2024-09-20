
// routes/auth.mjs
import express from 'express';
import supabase from '../supabaseClient.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { Server } from 'socket.io';
import http from 'http';
import { sendWhatsAppMessage } from '../twilioClient.js';  // Import Twilio client

const app = express;
const router = app.Router();
const server = http.createServer(app);
const io = new Server(server);
let currentTurnNumber = 1; // Número de turno actual


// Endpoint para obtener el número actual y los próximos
router.get('/turns', async (req, res) => {
    const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .order('turnNumber', { ascending: true })
        .gte('turnNumber', currentTurnNumber);

    const currentNumber = clients[0]?.turnNumber || null;
    const nextNumbers = clients.slice(1, 3).map(client => client.turnNumber);

    res.json({ currentNumber, nextNumbers });
});

// Endpoint para avanzar al siguiente turno
router.post('/next', verifyToken, async (req, res) => {
    currentTurnNumber += 1; // Incrementar el turno actual

    // Obtener los nuevos turnos desde Supabase
    const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .order('turnNumber', { ascending: true })
        .gte('turnNumber', currentTurnNumber);

    const currentNumber = clients[0]?.turnNumber || null;
    const nextNumbers = clients.slice(1, 3).map(client => client.turnNumber);

    // Emitir actualización a todos los clientes conectados
    io.emit('turn-update', { currentNumber, nextNumbers });

    // Enviar notificación por WhatsApp al cliente que está siendo atendido
    if (clients[0]?.phone) {
        sendWhatsAppMessage(clients[0].phone, `Es tu turno para ser atendido. Tu número es ${clients[0].turnNumber}.`);
    }

    res.json({ currentNumber, nextNumbers });
});

// Socket.IO connection for real-time updates
// io.on('connection', (socket) => {
//     console.log('New client connected');

//     // Send the current turn data when a new client connects
//     socket.emit('turn-update', {
//         currentTurnNumber,
//         nextNumbers: queue.slice(0, 2),
//     });

//     socket.on('disconnect', () => {
//         console.log('Client disconnected');
//     });
// });

// Endpoint para registrar un cliente con un número de teléfono
router.post('/register', async (req, res) => {
    const { phone } = req.body;
    console.log('phone', phone);
    if (!phone) {
        return res.status(400).json({ error: 'Número de teléfono requerido' });
    }

    // Obtener el último número de turno
    const { data: lastClient } = await supabase
        .from('clients')
        .select('turnNumber')
        .order('turnNumber', { ascending: false })
        .limit(1)
        .single();

    console.log('lastClient', lastClient);
    const newTurnNumber = lastClient ? lastClient.turnNumber + 1 : 1;

    // Insertar el nuevo cliente con su número de turno
    const { data, error } = await supabase
        .from('clients')
        .insert([{ phone, turnNumber: newTurnNumber }]);
    console.log('error', error);
    console.log('data', data);
    if (error) {
        return res.status(500).json({ error: 'Error al registrar el cliente' });
    }

    res.status(201).json({ turnNumber: newTurnNumber });
});

export default router;