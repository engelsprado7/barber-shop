// middleware/authMiddleware.mjs
import supabase from '../supabaseClient.js';

export const verifyToken = async (req, res, next) => {

    try {
        const { data: { user } } = await supabase.auth.getUser()

        console.log("user", user)
        if (!user.aud) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        req.user = user; // Attach user info to request
        next(); // Proceed to the next handler
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
