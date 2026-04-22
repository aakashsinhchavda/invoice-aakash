import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Invoice from '@/models/Invoice';

export async function GET() {
  await dbConnect();
  try {
    const invoices = await Invoice.find({}).populate('vendorId');
    return NextResponse.json(invoices);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const invoice = await Invoice.create(body);
    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
