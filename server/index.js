import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import houseRoutes from './routes/houses.js';
import billRoutes from './routes/bills.js';
import fineRoutes from './routes/fines.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/housing-society')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/houses', houseRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/fines', fineRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});