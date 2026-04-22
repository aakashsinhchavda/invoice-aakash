import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Vendor from '@/models/Vendor';

// Simple in-memory storage for mock mode
let mockVendors = [
  {
    _id: 'mock1',
    name: 'A J ENTERPRISE',
    address: 'KHALIFA VAAS, MAIN BAJAR, Panandhro,\nKachchh, 370601, India',
    gst: '24EEUPA7436G1ZB',
    contact: '916351724788',
    vendorCode: '576675'
  }
];

export async function GET() {
  const conn = await dbConnect();
  if (!conn) {
    return NextResponse.json(mockVendors);
  }
  
  try {
    const vendors = await Vendor.find({});
    return NextResponse.json(vendors);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  const conn = await dbConnect();
  const body = await req.json();

  if (!conn) {
    const newVendor = { ...body, _id: Date.now().toString() };
    mockVendors.push(newVendor);
    return NextResponse.json(newVendor, { status: 201 });
  }

  try {
    const vendor = await Vendor.create(body);
    return NextResponse.json(vendor, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
