import mongoose from 'mongoose';

const houseSchema = new mongoose.Schema({
  houseNumber: {
    type: String,
    required: true,
    unique: true
  },
  residentName: {
    type: String,
    required: true
  },
  houseSize: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('House', houseSchema);