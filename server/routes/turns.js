
// routes/auth.mjs
import express from 'express';
import supabase from '../supabaseClient.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { sendWhatsAppMessage } from '../twilioClient.js';  // Import Twilio client
import { getSocket } from '../socket.js'; // Import the getSocket function

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
  const { phone, name } = req.body;
  const user = req.user; // Assuming req.user contains authenticated user info
  if (!user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  if (!name) {
    return res.status(400).json({ error: 'El nombre es requerido' });
  }

  let { data: contacts, error: findError } = await supabase
    .rpc('search_contacts', {
      keyword: name,
    })

  if (findError) throw findError;

  //validate if the contact exists

  if (contacts.length == 0) {
    // Create a new Contact if it doesn't exist
    const { data, error } = await supabase
      .from('users')
      .insert([
        { name: name, phone: phone, user_id: user.id },
      ])
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
    .insert([{ phone, turnNumber: newTurnNumber, user_id: user.id, status: status, name }]).select();

  if (error) {
    return res.status(500).json({ error: 'Error al registrar el cliente' });
  }

  res.status(200).json({ id: data[0].id, turnNumber: newTurnNumber, status: status, name });
});

export default router;
