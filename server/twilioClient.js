// twilioClient.js
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// Configurar Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const sendWhatsAppMessage = (to, message) => {
    client.messages.create({
        from: 'whatsapp:+13603429147', // El número de WhatsApp proporcionado por Twilio
        to: `whatsapp:+505${to}`,
        body: message,
    })
        .then(message => console.log('Mensaje enviado:', message.sid))
        .catch(err => console.error('Error al enviar mensaje:', err));
};

