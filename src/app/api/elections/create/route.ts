import { NextResponse } from 'next/server';

import dbConnect from '@/Database/dbConnect';
import Election from '@/Database/models/election.model';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth()
    
    if (!session || (session.user).role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const {
      title,
      description,
      constituency,
      startDate,
      endDate,
      candidates
    } = body;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (end <= start) {
      return NextResponse.json(
        { message: 'End date must be after start date' },
        { status: 400 }
      );
    }

    // Determine status based on dates
    let status = 'upcoming';
    if (start <= now && end >= now) {
      status = 'active';
    } else if (end < now) {
      status = 'completed';
    }

    const election = await Election.create({
      title,
      description,
      constituency,
      startDate,
      endDate,
      candidates,
      status
    });

    return NextResponse.json(election, { status: 201 });
  } catch (error) {
    console.error('Error creating election:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}