// routes/auth.mjs
import express from 'express';
import supabase from '../supabaseClient.js';

const router = express.Router();

// Sign-up endpoint
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ message: 'User signed up successfully', data });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Sign-in endpoint
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({
            message: 'User signed in successfully',
            token: data.session.access_token, // Return JWT token for authentication
            refreshToken: data.session.refresh_token, // Return refresh token for session management
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
export default router;


