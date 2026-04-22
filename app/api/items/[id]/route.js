import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ItemMaster from '@/models/ItemMaster';

export async function PUT(req, { params }) {
  const { id } = await params;
  const conn = await dbConnect();
  const data = await req.json();

  if (!conn) {
    return NextResponse.json({ ...data, _id: id }, { status: 200 });
  }

  try {
    const item = await ItemMaster.findByIdAndUpdate(id, data, { new: true });
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json(item);
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
    const item = await ItemMaster.findByIdAndDelete(id);
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
