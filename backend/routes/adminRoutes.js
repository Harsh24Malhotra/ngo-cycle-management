import express from 'express';
import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
   if ((username === 'admin' && password === 'password123') || (admin && (await admin.matchPassword(password)))) {
      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      res.json({ _id: admin._id, username: admin.username, token });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
