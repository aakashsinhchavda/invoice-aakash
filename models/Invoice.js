import mongoose from 'mongoose';

const InvoiceItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  qty: { type: Number, required: true },
  unit: { type: String, required: true },
  rate: { type: Number, required: true },
  amount: { type: Number, required: true },
});

const InvoiceSchema = new mongoose.Schema({
  poNumber: { type: String, required: true },
  date: { type: Date, required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  jobDetails: { type: String },
  paymentTerms: { type: String },
  items: [InvoiceItemSchema],
  subTotal: { type: Number, required: true },
  cgst: { type: Number, required: true },
  sgst: { type: Number, required: true },
  finalTotal: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
