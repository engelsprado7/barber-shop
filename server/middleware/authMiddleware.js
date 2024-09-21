// middleware/authMiddleware.mjs
import supabase from '../supabaseClient.js';

export const verifyToken = async (req, res, next) => {

    const token = req.headers['authorization'];
    const refreshToken = req.headers['refresh_token'];

    console.log("token", token);
    console.log("refreshToken", refreshToken);
    if (!token) {
        return res.status(401).json({ error: 'Token is required' });
    }
    try {

        const { data: { user } } = await supabase.auth.getUser(token)

        console.log("currentUser", user);
        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        const { _, currentError } = await supabase.auth.refreshSession({ refresh_token: refreshToken })

        if (currentError) throw currentError;


        req.user = user; // Attach user info to request
        next(); // Proceed to the next handler
    } catch (error) {
        res.status(401).json({ error: error });
    }
};
