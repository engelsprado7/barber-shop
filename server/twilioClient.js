// twilioClient.js
import twilio from 'twilio';

// Configurar Twilio
const accountSid = 'AC6d73d0ccb4171130f96dad2b4427d03b';
const authToken = '1a86d19440150ac4762c2e8a3664d6dd';
const client = twilio(accountSid, authToken);

export const sendWhatsAppMessage = (to, message) => {
    client.messages.create({
        from: 'whatsapp:+14155238886', // El número de WhatsApp proporcionado por Twilio
        to: `whatsapp:${to}`,
        body: message,
    })
        .then(message => console.log('Mensaje enviado:', message.sid))
        .catch(err => console.error('Error al enviar mensaje:', err));
};

