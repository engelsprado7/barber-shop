
// routes/auth.mjs
import express from 'express';
import supabase from '../supabaseClient.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { sendWhatsAppMessage } from '../twilioClient.js';  // Import Twilio client
import { getSocket } from '../socket.js'; // Import the getSocket function
import Studio from 'twilio/lib/rest/Studio.js';

const app = express;
const router = app.Router();

//Endpoint for updating the clients turnNumber, phone, and status

router.put('/clients/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { turnNumber, phone, status } = req.body;
    console.log('id', id);
    try {
        const { data, error } = await supabase
            .from('clients')
            .update({ turnNumber, phone, status })
            .eq('id', id);

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).json({ message: 'Error updating client' });
    }
})

//Endpoint for getting the clients with pending status
// for example: /api/clients/pending?status=pending

router.get('/clients/pending', async (req, res) => {
    const { status } = req.query;
    if (status === 'pending') {
        try {
            const { data: pendingClients, error } = await supabase
                .from('clients')
                .select('*')
                .eq('status', 'pending');

            if (error) throw error;

            res.status(200).json({ clients: pendingClients });
        } catch (error) {
            console.error('Error fetching pending clients:', error);
            res.status(500).json({ message: 'Error fetching pending clients' });
        }
    } else {
        res.status(400).json({ error: 'Invalid status query parameter' });
    }
});


// Endpoint para obtener el número actual y los próximos
router.get('/clients', async (req, res) => {
    console.log('GETTING CLIENTS');
    try {
        // Fetch the current turn
        const { data: clients, error: currentError } = await supabase
            .from('clients')
            .select('*')
            .order('id', { ascending: true })

        if (currentError) throw currentError;

        // nextNubersEmit = nextNumbers;
        res.status(200).json({
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
        res.status(200).json({
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
    try {


        // Mark the current turn as completed
        const { data: current, error: completeError } = await supabase
            .from('clients')
            .update({ status: 'completed' })
            .eq('status', 'current').select();

        console.log('current', current);
        if (completeError) throw completeError;

        // Mark the next turn as current
        const { data, error: updateError } = await supabase
            .from('clients')
            .update({ status: 'current' })
            .eq('status', 'pending')
            .order('turnNumber', { ascending: true })
            .limit(1)
            .select();
        if (updateError) throw updateError;


        console.log('current', data);
        // Send a WhatsApp message to the current client

        if (current[0]?.phone) {
            console.log("SENDING WHATSAPP MESSAGE TO", current[0].phone);
            sendWhatsAppMessage(current[0].phone, `Es tu turno para ser atendido. Tu número es ${current[0].turnNumber}.`);
        }

        if (data.length === 0) {
            return res.status(200).json({ message: 'No hay más turnos pendientes' });
        }

        res.status(200).json({
            id: data[0].id,
            turnNumber: data[0].turnNumber,
            status: data[0].status,
            message: 'Notification sent',
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
        .insert([{ phone, turnNumber: newTurnNumber, user_id: user.id, status: status }]).select();
    console.log('error', error);
    console.log('data', data);
    if (error) {
        return res.status(500).json({ error: 'Error al registrar el cliente' });
    }

    res.status(200).json({ id: data[0].id, turnNumber: newTurnNumber, status: status });
});

export default router;
