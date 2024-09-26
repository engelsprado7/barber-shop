
import express from 'express';
import supabase from '../supabaseClient.js';
import { verifyToken } from '../middleware/authMiddleware.js';


const app = express;
const router = app.Router();

//Endpoint for getting the shop configuration

router.get('/shop', async (req, res) => {
    try {

        let { data: shop_configs, error } = await supabase
            .from('shop_configs')
            .select('*')

        if (error) throw error;

        console.log('shop_configs:', shop_configs);
        res.status(200).json(shop_configs[0]);
    } catch (error) {
        console.error('Error fetching shop status:', error);
        res.status(500).json({ message: 'Error fetching shop status' });
    }
})

//Endpoint for updating the shop status

router.put('/shop/:id', verifyToken, async (req, res) => {

    const { status } = req.body;
    console.log('status:', status);
    try {
        let { data, error } = await supabase
            .from('shop_configs')
            .update({ status })
            .eq('id', 1);

        if (error) throw error;

        console.log('data:', data);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error updating shop status:', error);
        res.status(500).json({ message: 'Error updating shop status' });
    }
});


export default router;
