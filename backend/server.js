import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import cycleRoutes from './routes/cycleRoutes.js';
import Admin from './models/Admin.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.use('/api/admin', adminRoutes);
app.use('/api/cycles', cycleRoutes);

const seedAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ username: 'admin' });
    if (!adminExists) {
      await Admin.create({ username: 'admin', password: 'password123' });
      console.log('Default Admin Account Seeded (admin / password123)');
    }
  } catch (err) {
    console.error('Seeding error:', err);
  }
};
seedAdmin();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
