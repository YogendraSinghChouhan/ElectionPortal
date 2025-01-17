import { NextResponse } from 'next/server';

import dbConnect from '@/Database/dbConnect';
import Election from '@/Database/models/election.model';
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

    const elections = await Election.find()
      .populate('constituency', 'name region')
      .sort({ startDate: -1 });

    return NextResponse.json(elections);
  } catch (error) {
    console.error('Error fetching elections:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}