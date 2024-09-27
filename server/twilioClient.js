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
        contentSid: "HX37dd4c0f646c26f830c128c559099c1f",
        messagingServiceSid: "MG17ccaeacb0652535dd6270d8e6397c6f",
        from: 'whatsapp:+13603429147', // El número de WhatsApp proporcionado por Twilio
        to: `whatsapp:+505${to}`
    })
        .then(message => console.log('Mensaje enviado:', message.sid))
        .catch(err => console.error('Error al enviar mensaje:', err));
};

