import { NextResponse } from 'next/server';
import dbConnect from '@/Database/dbConnect';
import User from '@/Database/models/user.model';
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

    const user = await User.findOne({ email: session.user?.email })
      .populate({
        path: 'votingHistory.election',
        select: 'title description startDate endDate'
      });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user.votingHistory);
  } catch (error) {
    console.error('Error fetching voting history:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}