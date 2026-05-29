import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import cycleRoutes from './routes/cycleRoutes.js';
import Admin from './models/Admin.js';

dotenv.config();

const fallbackFrontendUrl = 'https://ngo-cycle-management.vercel.app';
const configuredFrontendUrl = process.env.FRONTEND_URL || fallbackFrontendUrl;
process.env.FRONTEND_URL = configuredFrontendUrl;

const configuredAllowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([
  configuredFrontendUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...configuredAllowedOrigins,
]);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

connectDB();

const app = express();
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
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
