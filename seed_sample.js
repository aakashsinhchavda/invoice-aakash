const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || MONGODB_URI.includes('cluster0.mongodb.net') && MONGODB_URI.length < 50) {
  console.error('ERROR: MONGODB_URI is not set or invalid in .env.local.');
  process.exit(1);
}

// Define Schemas manually (to avoid Next.js import issues in standalone script)
const VendorSchema = new mongoose.Schema({
  name: String,
  address: String,
  gst: String,
  vendorCode: String,
  contact: String
});

const InvoiceSchema = new mongoose.Schema({
  poNumber: String,
  date: Date,
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  jobDetails: String,
  jobStateCode: String,
  finalTotal: Number,
  items: Array
}, { timestamps: true });

const ItemMasterSchema = new mongoose.Schema({
  title: String,
  sac: String,
  unit: String,
  defaultChildren: Array
});

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB...');

    const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);
    const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
    const ItemMaster = mongoose.models.ItemMaster || mongoose.model('ItemMaster', ItemMasterSchema);

    // 1. Create Vendor
    const vendor = await Vendor.create({
      name: 'A J ENTERPRISE',
      address: 'KHALIFA VAAS, MAIN BAJAR, Panandhro, Kachchh, 370601, India',
      gst: '24EEUPA7436G1ZB',
      vendorCode: '576675',
      contact: '916351724788'
    });
    console.log('Sample Vendor Created.');

    // 2. Create Library Item
    await ItemMaster.create({
      title: 'HIRING CHARGES OF VEHICLE',
      sac: '9966',
      unit: 'AU',
      defaultChildren: [
        { label: '10', description: 'HIRING CHARGES FOR SCORPIO', qty: 10, unit: 'MON', rate: 69000 },
        { label: '20', description: 'HIRING CHARGES FOR BOLERO', qty: 15, unit: 'MON', rate: 64000 }
      ]
    });
    console.log('Sample Library Item Created.');

    // 3. Create Invoice
    await Invoice.create({
      poNumber: '4400026168',
      date: new Date('2026-04-15'),
      vendorId: vendor._id,
      jobDetails: 'E/24/0022 500MW / 625 MWp Solar Project GIPCL-II K',
      jobStateCode: 'Gujarat',
      finalTotal: 3218450,
      items: [
        {
          description: 'HIRING CHARGES OF VEHICLE',
          sac: '9966',
          unit: 'AU',
          qty: 1,
          rate: 2727500,
          amount: 2727500,
          children: [
            { label: '10', description: 'HIRING CHARGES FOR SCORPIO', qty: 10, unit: 'MON', rate: 69000, amount: 690000 },
            { label: '20', description: 'HIRING CHARGES FOR BOLERO', qty: 15, unit: 'MON', rate: 64000, amount: 960000 }
          ]
        }
      ]
    });
    console.log('Sample Invoice Created.');

    console.log('SUCCESS: Sample data populated!');
    process.exit(0);
  } catch (err) {
    console.error('Seed Error:', err);
    process.exit(1);
  }
}

seed();
