import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import Cycle from '../models/Cycle.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.get('/public/:uuid', async (req, res) => {
  try {
    const cycle = await Cycle.findOne({ uuid: req.params.uuid });
    if (!cycle) return res.status(404).json({ message: 'Cycle record not found' });
    res.json(cycle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/create', protect, async (req, res) => {
  const { cycleId, condition, status } = req.body;
  try {
    const exists = await Cycle.findOne({ cycleId });
    if (exists) return res.status(400).json({ message: 'Cycle ID already exists' });

    const uuid = uuidv4();
    const qrUrl = `${process.env.FRONTEND_URL}/cycle/${uuid}`;
    const qrImageBase64 = await QRCode.toDataURL(qrUrl, { width: 400, margin: 2 });

    const cycle = await Cycle.create({
      cycleId,
      uuid,
      qrImage: qrImageBase64,
      condition,
      status,
      currentBeneficiary: { name: "", phone: "", village: "", assignedDate: "" }
    });

    res.status(201).json(cycle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const cycles = await Cycle.find({}).sort({ createdAt: -1 });
    res.json(cycles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/assign', protect, async (req, res) => {
  const { name, phone, village, assignedDate } = req.body;
  try {
    const cycle = await Cycle.findById(req.params.id);
    if (!cycle) return res.status(404).json({ message: 'Cycle not found' });

    cycle.status = 'Assigned';
    cycle.currentBeneficiary = { name, phone, village, assignedDate };
    await cycle.save();
    res.json(cycle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/return', protect, async (req, res) => {
  try {
    const cycle = await Cycle.findById(req.params.id);
    if (!cycle) return res.status(404).json({ message: 'Cycle not found' });

    cycle.status = 'Available';
    cycle.currentBeneficiary = { name: "", phone: "", village: "", assignedDate: "" };
    await cycle.save();
    res.json(cycle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/update', protect, async (req, res) => {
  const { condition, status } = req.body;
  try {
    const cycle = await Cycle.findById(req.params.id);
    if (!cycle) return res.status(404).json({ message: 'Cycle not found' });

    cycle.condition = condition || cycle.condition;
    cycle.status = status || cycle.status;
    await cycle.save();
    res.json(cycle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const cycle = await Cycle.findById(req.params.id);
    if (!cycle) return res.status(404).json({ message: 'Cycle not found' });
    await cycle.deleteOne();
    res.json({ message: 'Cycle removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
