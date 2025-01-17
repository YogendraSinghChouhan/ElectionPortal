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

    const upcomingElections = await Election.find({
      status: { $in: ['upcoming', 'active'] },
      endDate: { $gte: new Date() }
    })
    .sort({ startDate: 1 })
    .limit(5);

    return NextResponse.json(upcomingElections);
  } catch (error) {
    console.error('Error fetching upcoming elections:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}