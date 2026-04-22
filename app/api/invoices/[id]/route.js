import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Invoice from '@/models/Invoice';

export async function DELETE(req, { params }) {
  const { id } = await params;
  const conn = await dbConnect();

  if (!conn) {
    return NextResponse.json({ message: 'Deleted in mock mode' }, { status: 200 });
  }

  try {
    const invoice = await Invoice.findByIdAndDelete(id);
    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
