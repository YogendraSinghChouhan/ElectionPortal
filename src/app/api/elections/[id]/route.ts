import { NextResponse } from 'next/server';

import dbConnect from '@/Database/dbConnect';
import Election from '@/Database/models/election.model';
import { auth } from '@/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = (await params).id;
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const election = await Election.findById(id)
      .populate('constituency', 'name region')
      .populate('candidates');

    if (!election) {
      return NextResponse.json(
        { message: 'Election not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(election);
  } catch (error) {
    console.error('Error fetching election:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}