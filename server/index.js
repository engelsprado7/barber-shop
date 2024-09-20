// Import modules using ES syntax
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.js';
import turnRoutes from './routes/turns.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());


// Authentication Routes
app.use('/api', authRoutes);

// Turn Routes (Protected)
app.use('/api', turnRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



