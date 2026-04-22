import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Vendor from '@/models/Vendor';

export async function PUT(req, { params }) {
  const { id } = await params;
  const conn = await dbConnect();
  const body = await req.json();

  if (!conn) {
    return NextResponse.json({ ...body, _id: id }, { status: 200 });
  }

  try {
    const vendor = await Vendor.findByIdAndUpdate(id, body, { new: true });
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }
    return NextResponse.json(vendor);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  const conn = await dbConnect();

  if (!conn) {
    return NextResponse.json({ message: 'Deleted in mock mode' }, { status: 200 });
  }

  try {
    const vendor = await Vendor.findByIdAndDelete(id);
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
