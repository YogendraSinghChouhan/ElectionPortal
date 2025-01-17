import { NextResponse } from 'next/server';
import dbConnect from '@/Database/dbConnect';
import Constituency from '@/Database/models/constituency.model';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
      const session = await auth();
    
    if (!session || (session.user).role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const { name, region } = body;

    // Check if constituency already exists
    const existingConstituency = await Constituency.findOne({ name });
    if (existingConstituency) {
      return NextResponse.json(
        { message: 'Constituency already exists' },
        { status: 400 }
      );
    }

    const constituency = await Constituency.create({
      name,
      region,
    });

    return NextResponse.json(constituency, { status: 201 });
  } catch (error) {
    console.error('Error creating constituency:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}