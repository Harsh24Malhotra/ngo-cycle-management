import mongoose from 'mongoose';

const cycleSchema = new mongoose.Schema({
  cycleId: { type: String, required: true, unique: true },
  uuid: { type: String, required: true, unique: true },
  qrImage: { type: String, required: true }, 
  status: { type: String, required: true, enum: ['Available', 'Assigned', 'Under Repair'], default: 'Available' },
  condition: { type: String, required: true, enum: ['Good', 'Damaged', 'Needs Service'], default: 'Good' },
  currentBeneficiary: {
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
    village: { type: String, default: "" },
    assignedDate: { type: String, default: "" }
  }
}, { timestamps: true });

export default mongoose.model('Cycle', cycleSchema);