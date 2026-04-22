import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ItemMaster from '@/models/ItemMaster';

export async function GET() {
  try {
    const conn = await dbConnect();
    if (!conn) return NextResponse.json([]); // Return empty array in mock mode
    const items = await ItemMaster.find({}).sort({ title: 1 });
    return NextResponse.json(items);
  } catch (error) {
    console.error("GET /api/items error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req) {
  try {
    const conn = await dbConnect();
    if (!conn) return NextResponse.json({ _id: 'mock-' + Date.now() }, { status: 201 });
    const data = await req.json();
    const item = await ItemMaster.create(data);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
