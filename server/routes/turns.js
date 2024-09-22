
// routes/auth.mjs
import express from 'express';
import supabase from '../supabaseClient.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { sendWhatsAppMessage } from '../twilioClient.js';  // Import Twilio client
import { getSocket } from '../socket.js'; // Import the getSocket function

const app = express;
const router = app.Router();


// Endpoint para obtener el número actual y los próximos
router.get('/clients', async (req, res) => {
    try {
        // Fetch the current turn
        const { data: clients, error: currentError } = await supabase
            .from('clients')
            .select('*')
            .order('id', { ascending: true })

        if (currentError) throw currentError;

        // nextNubersEmit = nextNumbers;
        res.json({
            clients,
        });
    } catch (error) {
        console.error('Error fetching turns:', error);
        res.status(500).json({ message: 'Error fetching turns' });
    }
});

// Endpoint para obtener el número actual y los próximos
router.get('/turns', async (req, res) => {
    try {
        // Fetch the current turn
        const { data: current, error: currentError } = await supabase
            .from('clients')
            .select('*')
            .eq('status', 'current')
            .order('id', { ascending: true })
            .limit(1);

        if (currentError) throw currentError;

        console.log('current', current);
        // Fetch the next two pending turns
        const { data: next, error: nextError } = await supabase
            .from('clients')
            .select('*')
            .eq('status', 'pending')
            .order('turnNumber', { ascending: true })
            .limit(2)


        if (nextError) throw nextError;

        const currentNumber = current.length > 0 ? current[0].turnNumber : null;
        const nextNumbers = next.map((turn) => turn.turnNumber);
        // nextNumbersEmit = nextNumbers;
        res.json({
            currentNumber,
            nextNumbers,
        });
    } catch (error) {
        console.error('Error fetching turns:', error);
        res.status(500).json({ message: 'Error fetching turns' });
    }
});

// Endpoint para avanzar al siguiente turno
router.post('/next', verifyToken, async (req, res) => {
    const io = getSocket();
    try {


        // Mark the current turn as completed
        const { error: completeError } = await supabase
            .from('clients')
            .update({ status: 'completed' })
            .eq('status', 'current');


        if (completeError) throw completeError;

        // Mark the next turn as current
        const { error: updateError } = await supabase
            .from('clients')
            .update({ status: 'current' })
            .eq('status', 'pending')
            .order('turnNumber', { ascending: true })
            .limit(1);

        if (updateError) throw updateError;

        // Fetch the current turn
        const { data: current, error: currentError } = await supabase
            .from('clients')
            .select('*')
            .eq('status', 'current')
            .order('id', { ascending: true })
            .limit(1);


        if (currentError) throw currentError;
        // Fetch the next two pending turns
        const { data: next, error: nextError } = await supabase
            .from('clients')
            .select('*')
            .eq('status', 'pending')
            .order('turnNumber', { ascending: true })
            .limit(2)

        if (nextError) throw nextError;

        const currentNumber = current.length > 0 ? current[0].turnNumber : null;
        const nextNumbers = next.map((turn) => turn.turnNumber);

        // Send a WhatsApp message to the current client

        if (current[0]?.phone) {
            console.log("SENDING WHATSAPP MESSAGE TO", current[0].phone);
            sendWhatsAppMessage(current[0].phone, `Es tu turno para ser atendido. Tu número es ${current[0].turnNumber}.`);
        }

        // Emit the updated numbers to all connected clients
        io.emit('turnsUpdate', {
            currentNumber,
            nextNumbers,
        });

        res.status(200).json({
            currentNumber,
        });
    } catch (error) {
        console.error('Error updating turn:', error);
        res.status(500).json({ message: 'Error updating turn' });
    }
});



// Endpoint para registrar un cliente con un número de teléfono
router.post('/register', verifyToken, async (req, res) => {
    const { phone } = req.body;
    const user = req.user; // Assuming req.user contains authenticated user info
    const io = getSocket();
    if (!user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!phone) {
        return res.status(400).json({ error: 'Número de teléfono requerido' });
    }

    // Obtener el último número de turno
    const { data: lastClient } = await supabase
        .from('clients')
        .select('*')
        .order('turnNumber', { ascending: false })
        .limit(1);


    const newTurnNumber = lastClient.length > 0 ? lastClient[0].turnNumber + 1 : 1;
    // Set the initial status based on whether it's the first client
    let status = ''
    if (lastClient.length > 0) {
        status = lastClient[0].status == 'completed' ? 'current' : 'pending'
    } else
        status = 'current'

    // Insertar el nuevo cliente con su número de turno
    const { data, error } = await supabase
        .from('clients')
        .insert([{ phone, turnNumber: newTurnNumber, user_id: user.id, status: status }]);
    console.log('error', error);
    console.log('data', data);
    if (error) {
        return res.status(500).json({ error: 'Error al registrar el cliente' });
    }

    // Fetch the next two pending turns
    const { data: next, error: nextError } = await supabase
        .from('clients')
        .select('*')
        .eq('status', 'pending')
        .order('turnNumber', { ascending: true })
        .limit(2)

    if (nextError) throw nextError;

    console.log('NEXT', next);

    // Fetch the current turn
    const { data: current, error: currentError } = await supabase
        .from('clients')
        .select('*')
        .eq('status', 'current')
        .order('turnNumber', { ascending: true })
        .limit(1);

    if (currentError) throw currentError;

    const currentNumber = current.length > 0 ? current[0].turnNumber : 1;
    const nextNumbers = next.map((turn) => turn.turnNumber);

    // Emit the updated numbers to all connected clients
    io.emit('turnsUpdate', {
        currentNumber: currentNumber,
        nextNumbers: nextNumbers,
    });
    res.status(201).json({ turnNumber: newTurnNumber });
});

export default router;
