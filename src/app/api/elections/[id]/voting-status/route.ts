import { NextResponse } from 'next/server';
import dbConnect from '@/Database/dbConnect';
import User from '@/Database/models/user.model';
import { auth } from '@/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = (await params).id;
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findOne({
      email: session.user?.email,
      'votingHistory.election': id
    });

    return NextResponse.json({ hasVoted: !!user });
  } catch (error) {
    console.error('Error checking voting status:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}