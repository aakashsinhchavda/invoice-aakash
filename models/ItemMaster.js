import mongoose from 'mongoose';

const SubItemSchema = new mongoose.Schema({
  label: { type: String },
  description: { type: String, required: true },
  qty: { type: Number, default: 1 },
  unit: { type: String, default: 'Nos' },
  rate: { type: Number, default: 0 },
});

const ItemMasterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  sac: { type: String, default: '' },
  unit: { type: String, default: 'AU' },
  defaultChildren: [SubItemSchema],
}, { timestamps: true });

export default mongoose.models.ItemMaster || mongoose.model('ItemMaster', ItemMasterSchema);
