import { NextResponse } from 'next/server';

import dbConnect from '@/Database/dbConnect';
import Constituency from '@/Database/models/constituency.model';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const constituencies = await Constituency.find()
      .select('name region')
      .sort('name');

    return NextResponse.json(constituencies);
  } catch (error) {
    console.error('Error fetching constituencies:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}