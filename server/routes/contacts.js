import express from 'express';
import supabase from '../supabaseClient.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const app = express;
const router = app.Router();

//Enpoint for creating a new contact

router.post('/contacts', verifyToken, async (req, res) => {

    const { name, phone } = req.body;

    try {
        let { data, error } = await supabase
            .from('contacts')
            .insert([{ name, phone, user_id: req.user.id }]);

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({ message: 'Error creating contact' });
    }
});


// Endpoint for searching contacts
router.get('/contacts/search', verifyToken, async (req, res) => {
    const { query } = req.query; // Use req.query to get the query parameter
    console.log('query:', query);
    try {
        let { data: contacts, error } = await supabase
            .rpc('search_contacts', {
                keyword: query,
            })

        console.log('contacts:', contacts);
        if (error) throw error;

        res.status(200).json({ contacts });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Error fetching contacts' });
    }
});

export default router;