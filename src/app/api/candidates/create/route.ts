import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/Database/dbConnect';
import Candidate from '@/Database/models/candidate.model';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { name, constituency } = await request.json();

    if (!name || !constituency) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const newCandidate = await Candidate.create({ name, constituency });
    return NextResponse.json({ message: 'Candidate created', candidate: newCandidate }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error creating candidate' }, { status: 500 });
  }
}