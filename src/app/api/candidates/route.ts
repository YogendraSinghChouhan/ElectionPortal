import { NextResponse } from 'next/server';
import dbConnect from '@/Database/dbConnect';
import Candidate from '@/Database/models/candidate.model';
import { auth } from '@/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const constituencyId = searchParams.get('constituency');

    await dbConnect();

    const query = constituencyId ? { constituency: constituencyId } : {};
    
    const candidates = await Candidate.find(query)
      .select('name  constituency')
      .populate('constituency', 'name region')
      .sort('name');

    return NextResponse.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}