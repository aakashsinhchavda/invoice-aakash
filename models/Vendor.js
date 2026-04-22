import mongoose from 'mongoose';

const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  gst: { type: String, required: true },
  contact: { type: String, required: true },
  vendorCode: { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);
